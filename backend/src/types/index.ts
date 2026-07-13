// src/types/index.ts

export interface User {
    id: number;
    username: string;
    email: string;
    passwordHashed: string;
    reputation: number | null;
    createdAt: Date | null;
}

export interface Question {
    id: number;
    title: string;
    body: string;
    authorId: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface Answer {
    id: number;
    body: string;
    questionId: number;
    authorId: number;
    isAccepted: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface Comment {
    id: number;
    body: string;
    authorId: number;
    targetType: 'question' | 'answer';
    targetId: number;
    createdAt: Date | null;
}

export interface Vote {
    id: number;
    userId: number;
    targetType: 'question' | 'answer';
    targetId: number;
    voteType: -1 | 1;
    createdAt: Date | null;
}