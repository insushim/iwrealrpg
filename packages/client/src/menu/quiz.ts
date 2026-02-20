import Menu from './menu';

import Util from '../utils/util';

import { Opcodes, Packets } from '@kaetram/common/network';

import type Game from '../game';
import type { QuizQuestionData, QuizResultData } from '@kaetram/common/network/impl/quiz';

export default class Quiz extends Menu {
    // Container elements
    private title: HTMLElement = document.querySelector('#quiz-title')!;
    private questionText: HTMLElement = document.querySelector('#quiz-question')!;
    private option1: HTMLElement = document.querySelector('#quiz-option1')!;
    private option2: HTMLElement = document.querySelector('#quiz-option2')!;
    private timerText: HTMLElement = document.querySelector('#quiz-timer')!;
    private timerBar: HTMLElement = document.querySelector('#quiz-timer-bar')!;
    private streakText: HTMLElement = document.querySelector('#quiz-streak')!;
    private resultOverlay: HTMLElement = document.querySelector('#quiz-result')!;

    private quizId = '';
    private timeLimit = 10;
    private timerInterval: ReturnType<typeof setInterval> | null = null;
    private startTime = 0;
    private answered = false;

    private keyHandler: ((e: KeyboardEvent) => void) | null = null;

    public constructor(private game: Game) {
        super('#quiz');
    }

    /**
     * Shows the quiz popup with question data.
     */

    public question(data: QuizQuestionData): void {
        this.quizId = data.quizId;
        this.timeLimit = data.timeLimit;
        this.startTime = Date.now();
        this.answered = false;

        // Set content
        this.title.textContent = `${data.mobName}\uC744(\uB97C) \uCC98\uCE58\uD588\uB2E4!`;

        this.questionText.innerHTML =
            data.type === 0
                ? `<span class="quiz-word">"${data.question}"</span> \uC758 \uB73B\uC740?`
                : `<span class="quiz-word">"${data.question}"</span> \uB97C \uC601\uC5B4\uB85C?`;

        this.option1.textContent = `1. ${data.option1}`;
        this.option2.textContent = `2. ${data.option2}`;

        // Reset option styles
        this.option1.className = 'quiz-option slice-button stroke';
        this.option2.className = 'quiz-option slice-button stroke';

        // Streak display
        if (data.streak > 0) {
            this.streakText.textContent = `\uC5F0\uC18D \uC815\uB2F5: ${data.streak}\uD68C`;
            this.streakText.style.display = 'block';
        } else this.streakText.style.display = 'none';

        // Hide result overlay
        this.resultOverlay.style.display = 'none';

        // Show the quiz
        this.show();

        // Start timer
        this.startTimer();

        // Setup click handlers
        this.option1.addEventListener('click', () => this.selectAnswer(1));
        this.option2.addEventListener('click', () => this.selectAnswer(2));

        // Setup keyboard handlers
        this.removeKeyHandler();
        this.keyHandler = (e: KeyboardEvent) => {
            if (this.answered) return;
            if (e.key === '1' || e.key === 'ArrowLeft') this.selectAnswer(1);
            else if (e.key === '2' || e.key === 'ArrowRight') this.selectAnswer(2);
        };
        document.addEventListener('keydown', this.keyHandler);
    }

    /**
     * Select an answer and send to server.
     */

    private selectAnswer(answer: number): void {
        if (this.answered) return;
        this.answered = true;

        // Highlight selected
        if (answer === 1) this.option1.classList.add('selected');
        else this.option2.classList.add('selected');

        // Stop timer
        this.stopTimer();

        // Send answer to server
        this.game.socket.send(Packets.Quiz, {
            opcode: Opcodes.Quiz.Answer,
            quizId: this.quizId,
            selectedAnswer: answer
        });
    }

    /**
     * Show quiz result.
     */

    public result(data: QuizResultData): void {
        this.stopTimer();
        this.removeKeyHandler();

        this.resultOverlay.style.display = 'flex';

        if (data.correct) {
            this.resultOverlay.innerHTML = `
                <div class="quiz-result-correct">
                    <span class="quiz-result-icon">&#10004;</span>
                    <span class="quiz-result-text">\uC815\uB2F5!</span>
                    ${
                        data.goldReward > 0
                            ? `<span class="quiz-result-reward">+${data.goldReward} Gold</span>`
                            : ''
                    }
                    ${
                        data.bonusMultiplier > 1
                            ? `<span class="quiz-result-bonus">\uB4DC\uB86D\uB960 ${data.bonusMultiplier}\uBC30!</span>`
                            : ''
                    }
                </div>
            `;
            this.resultOverlay.className = 'quiz-result correct';
        } else {
            this.resultOverlay.innerHTML = `
                <div class="quiz-result-wrong">
                    <span class="quiz-result-icon">&#10008;</span>
                    <span class="quiz-result-text">\uC624\uB2F5!</span>
                    <span class="quiz-result-answer">\uC815\uB2F5: ${data.correctAnswer}</span>
                </div>
            `;
            this.resultOverlay.className = 'quiz-result wrong';
        }

        // Update streak display
        if (data.streak > 0) {
            this.streakText.textContent = `\uC5F0\uC18D \uC815\uB2F5: ${data.streak}\uD68C`;
            this.streakText.style.display = 'block';
        }

        // Auto-hide after 2 seconds
        setTimeout(() => {
            this.hide();
        }, 2000);
    }

    private startTimer(): void {
        this.stopTimer();

        let remaining = this.timeLimit;
        this.timerText.textContent = `\uB0A8\uC740 \uC2DC\uAC04: ${remaining}\uCD08`;
        this.timerBar.style.width = '100%';
        this.timerBar.className = 'quiz-timer-fill';

        this.timerInterval = setInterval(() => {
            let elapsed = (Date.now() - this.startTime) / 1000;
            remaining = Math.max(0, this.timeLimit - elapsed);

            this.timerText.textContent = `\uB0A8\uC740 \uC2DC\uAC04: ${Math.ceil(remaining)}\uCD08`;
            this.timerBar.style.width = `${(remaining / this.timeLimit) * 100}%`;

            if (remaining <= 3) {
                this.timerBar.className = 'quiz-timer-fill urgent';
                this.timerText.className = 'quiz-timer-text urgent';
            }

            if (remaining <= 0) this.stopTimer();
        }, 100);
    }

    private stopTimer(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    private removeKeyHandler(): void {
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
            this.keyHandler = null;
        }
    }

    public override show(): void {
        Util.fadeIn(this.container);
    }

    public override hide(): void {
        Util.fadeOut(this.container);
        this.stopTimer();
        this.removeKeyHandler();
    }
}
