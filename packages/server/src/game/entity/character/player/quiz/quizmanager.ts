import vocabularyData from '../../../../../../data/vocabulary.json';

import Utils from '@kaetram/common/util/utils';
import { Opcodes } from '@kaetram/common/network';
import { QuizPacket } from '@kaetram/common/network/impl';

import type Player from '../player';
import type { QuizResultData } from '@kaetram/common/network/impl/quiz';

interface VocabWord {
    id: string;
    english: string;
    korean: string;
    category: string;
    difficulty: number;
}

interface ActiveQuiz {
    quizId: string;
    word: VocabWord;
    type: number; // 0 = english->korean, 1 = korean->english
    correctAnswer: number; // 1 or 2
    timestamp: number;
    timeLimit: number;
    pendingDrops: { key: string; count: number }[];
    mobX: number;
    mobY: number;
    ownerUsername: string;
}

export interface QuizStats {
    totalQuestions: number;
    correctAnswers: number;
    currentStreak: number;
    bestStreak: number;
    recentWrong: string[];
    vocabLevel: number;
}

export default class QuizManager {
    private activeQuiz: ActiveQuiz | null = null;
    public stats: QuizStats;
    private words: Map<number, VocabWord[]> = new Map();

    public constructor(private player: Player) {
        // Initialize stats
        this.stats = {
            totalQuestions: 0,
            correctAnswers: 0,
            currentStreak: 0,
            bestStreak: 0,
            recentWrong: [],
            vocabLevel: 1
        };

        // Load vocabulary
        this.loadVocabulary();
    }

    private loadVocabulary(): void {
        let { levels } = vocabularyData as { levels: { [key: string]: { words: VocabWord[] } } };

        for (let [level, data] of Object.entries(levels))
            this.words.set(parseInt(level), data.words);
    }

    /**
     * Get vocab level based on mob level.
     * @param mobLevel The level of the mob that was killed.
     * @returns The vocabulary difficulty level.
     */

    public getVocabLevel(mobLevel: number): number {
        if (mobLevel <= 5) return 1;
        if (mobLevel <= 15) return 2;
        if (mobLevel <= 30) return 3;
        return 4;
    }

    /**
     * Generate a quiz for the player after killing a mob.
     * @param mobName The name of the mob that was killed.
     * @param mobLevel The level of the mob.
     * @param pendingDrops The drops that will be given if the quiz is answered correctly.
     * @param mobX The x position of the mob.
     * @param mobY The y position of the mob.
     * @param ownerUsername The username of the player who killed the mob.
     */

    public generateQuiz(
        mobName: string,
        mobLevel: number,
        pendingDrops: { key: string; count: number }[],
        mobX: number,
        mobY: number,
        ownerUsername: string
    ): void {
        if (this.activeQuiz) return; // Already has active quiz

        let vocabLevel = this.getVocabLevel(mobLevel),
            wordPool = this.words.get(vocabLevel);

        if (!wordPool || wordPool.length < 2) return;

        // Pick a random word
        let wordIndex = Utils.randomInt(0, wordPool.length - 1),
            word = wordPool[wordIndex],
            // Determine quiz type (0 = en->ko, 1 = ko->en)
            type = Math.random() < 0.5 ? 0 : 1,
            // Generate wrong answer from same category first, fallback to same level
            wrongWord: VocabWord,
            sameCategoryWords = wordPool.filter(
                (w) => w.category === word.category && w.id !== word.id
            );

        if (sameCategoryWords.length > 0)
            wrongWord = sameCategoryWords[Utils.randomInt(0, sameCategoryWords.length - 1)];
        else {
            let otherWords = wordPool.filter((w) => w.id !== word.id);
            wrongWord = otherWords[Utils.randomInt(0, otherWords.length - 1)];
        }

        // Randomize correct answer position
        let correctAnswer = Math.random() < 0.5 ? 1 : 2,
            question: string,
            option1: string,
            option2: string;

        if (type === 0) {
            // English -> Korean
            question = word.english;

            if (correctAnswer === 1) {
                option1 = word.korean;
                option2 = wrongWord.korean;
            } else {
                option1 = wrongWord.korean;
                option2 = word.korean;
            }
        } else {
            // Korean -> English
            question = word.korean;

            if (correctAnswer === 1) {
                option1 = word.english;
                option2 = wrongWord.english;
            } else {
                option1 = wrongWord.english;
                option2 = word.english;
            }
        }

        let quizId = `quiz-${this.player.instance}-${Date.now()}`,
            timeLimit = 10;

        this.activeQuiz = {
            quizId,
            word,
            type,
            correctAnswer,
            timestamp: Date.now(),
            timeLimit,
            pendingDrops,
            mobX,
            mobY,
            ownerUsername
        };

        // Send quiz question to player
        this.player.send(
            new QuizPacket(Opcodes.Quiz.Question, {
                quizId,
                type,
                question,
                option1,
                option2,
                timeLimit,
                mobName,
                streak: this.stats.currentStreak
            })
        );

        // Set timeout for no answer
        setTimeout(
            () => {
                if (this.activeQuiz?.quizId === quizId) this.handleTimeout();
            },
            (timeLimit + 1) * 1000
        );
    }

    /**
     * Handle player's answer to a quiz question.
     * @param quizId The unique identifier of the quiz.
     * @param selectedAnswer The answer selected by the player (1 or 2).
     */

    public handleAnswer(quizId: string, selectedAnswer: number): void {
        if (!this.activeQuiz || this.activeQuiz.quizId !== quizId) return;

        let elapsed = Date.now() - this.activeQuiz.timestamp,
            timeExpired = elapsed > this.activeQuiz.timeLimit * 1000;

        if (timeExpired) {
            this.handleTimeout();
            return;
        }

        let correct = selectedAnswer === this.activeQuiz.correctAnswer;

        this.stats.totalQuestions++;

        if (correct) {
            this.stats.correctAnswers++;
            this.stats.currentStreak++;

            if (this.stats.currentStreak > this.stats.bestStreak)
                this.stats.bestStreak = this.stats.currentStreak;

            // Remove from wrong list if present
            let idx = this.stats.recentWrong.indexOf(this.activeQuiz.word.id);

            if (idx > -1) this.stats.recentWrong.splice(idx, 1);

            // Drop items with multiplier
            let multiplier = this.getDropMultiplier();

            this.spawnDrops(multiplier);
        } else {
            this.stats.currentStreak = 0;

            // Add to wrong list
            if (!this.stats.recentWrong.includes(this.activeQuiz.word.id)) {
                this.stats.recentWrong.push(this.activeQuiz.word.id);

                if (this.stats.recentWrong.length > 50) this.stats.recentWrong.shift();
            }
        }

        // Check for level up
        this.checkLevelUp();

        // Build correct answer string
        let correctAnswerStr =
                this.activeQuiz.type === 0
                    ? this.activeQuiz.word.korean
                    : this.activeQuiz.word.english,
            // Send result
            goldReward = correct ? Utils.randomInt(5, 20) * this.getDropMultiplier() : 0;

        this.player.send(
            new QuizPacket(Opcodes.Quiz.Result, {
                correct,
                correctAnswer: correctAnswerStr,
                goldReward: Math.floor(goldReward),
                streak: this.stats.currentStreak,
                totalCorrect: this.stats.correctAnswers,
                totalQuestions: this.stats.totalQuestions,
                bonusMultiplier: this.getDropMultiplier()
            } as QuizResultData)
        );

        this.activeQuiz = null;
        this.player.save();
    }

    /**
     * Handles the case where the player does not answer in time.
     */

    private handleTimeout(): void {
        if (!this.activeQuiz) return;

        this.stats.totalQuestions++;
        this.stats.currentStreak = 0;

        // Add to wrong list
        if (!this.stats.recentWrong.includes(this.activeQuiz.word.id)) {
            this.stats.recentWrong.push(this.activeQuiz.word.id);

            if (this.stats.recentWrong.length > 50) this.stats.recentWrong.shift();
        }

        let correctAnswerStr =
            this.activeQuiz.type === 0 ? this.activeQuiz.word.korean : this.activeQuiz.word.english;

        this.player.send(
            new QuizPacket(Opcodes.Quiz.Result, {
                correct: false,
                correctAnswer: correctAnswerStr,
                goldReward: 0,
                streak: 0,
                totalCorrect: this.stats.correctAnswers,
                totalQuestions: this.stats.totalQuestions,
                bonusMultiplier: 1
            } as QuizResultData)
        );

        this.activeQuiz = null;
        this.player.save();
    }

    /**
     * Calculates the drop multiplier based on the current streak.
     * @returns The multiplier value for drops.
     */

    private getDropMultiplier(): number {
        if (this.stats.currentStreak >= 10) return 3;
        if (this.stats.currentStreak >= 5) return 2;
        if (this.stats.currentStreak >= 3) return 1.5;
        return 1;
    }

    /**
     * Spawns the pending drops with a multiplier applied.
     * @param multiplier The multiplier to apply to the drop counts.
     */

    private spawnDrops(multiplier: number): void {
        if (!this.activeQuiz) return;

        let { pendingDrops, mobX, mobY, ownerUsername } = this.activeQuiz;

        for (let drop of pendingDrops) {
            let count = Math.floor(drop.count * multiplier);

            if (count < 1) count = 1;

            this.player.world.entities.spawnItem(
                drop.key,
                mobX,
                mobY,
                true,
                count,
                {},
                ownerUsername
            );
        }
    }

    /**
     * Checks if the player should level up their vocabulary level based on accuracy.
     */

    private checkLevelUp(): void {
        if (this.stats.totalQuestions >= 30 && this.stats.vocabLevel < 4) {
            let accuracy = this.stats.correctAnswers / this.stats.totalQuestions;

            if (accuracy >= 0.8) this.stats.vocabLevel = Math.min(4, this.stats.vocabLevel + 1);
        }
    }

    /**
     * @returns Whether or not the player has an active quiz.
     */

    public hasActiveQuiz(): boolean {
        return this.activeQuiz !== null;
    }

    /**
     * Serializes the quiz stats for database saving.
     * @returns The serialized quiz stats.
     */

    public serialize(): QuizStats {
        return { ...this.stats };
    }

    /**
     * Loads quiz stats from the database.
     * @param data The quiz stats data from the database.
     */

    public load(data: QuizStats): void {
        if (!data) return;

        this.stats = { ...this.stats, ...data };
    }
}
