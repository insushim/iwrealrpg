import Packet from '../packet';

import { Packets } from '@kaetram/common/network';

import type { Opcodes } from '@kaetram/common/network';

export interface QuizQuestionData {
    quizId: string;
    type: number; // 0 = english->korean, 1 = korean->english
    question: string;
    option1: string;
    option2: string;
    timeLimit: number;
    mobName: string;
    streak: number;
}

export interface QuizAnswerData {
    quizId: string;
    selectedAnswer: number; // 1 or 2
}

export interface QuizResultData {
    correct: boolean;
    correctAnswer: string;
    goldReward: number;
    streak: number;
    totalCorrect: number;
    totalQuestions: number;
    bonusMultiplier: number;
}

export type QuizPacketData = QuizQuestionData | QuizAnswerData | QuizResultData;

export type QuizPacketCallback = (opcode: Opcodes.Quiz, data: QuizPacketData) => void;

export default class QuizPacket extends Packet {
    public constructor(opcode: Opcodes.Quiz, data: QuizPacketData) {
        super(Packets.Quiz, opcode, data);
    }
}
