// src/types/index.ts

export interface User {
    id: number;
    username: string | null;
    email: string | null;
    passwordHashed: string | null;
    reputation: number | null;
    createdAt: Date | null;
}

export interface Question {
    id: number;
    title: string | null;
    body: string | null;
    authorId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface Answer {
    id: number;
    body: string | null;
    questionId: number | null;
    authorId: number | null;
    isAccepted: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface Comment {
    id: number;
    body: string | null;
    authorId: number | null;
    targetType: 'question' | 'answer' | null;
    targetId: number | null;
    createdAt: Date | null;
}

export interface Vote {
    id: number;
    userId: number | null;
    targetType: 'question' | 'answer' | null;
    targetId: number | null;
    voteType: -1 | 1 | null;
    createdAt: Date | null;
}