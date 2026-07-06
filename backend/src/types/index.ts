// src/types/index.ts

export interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    reputation: number;
    created_at: Date;
}

export interface Question {
    id: number;
    title: string;
    body: string;
    author_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface Answer {
    id: number;
    body: string;
    question_id: number;
    author_id: number;
    is_accepted: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface Comment {
    id: number;
    body: string;
    author_id: number;
    target_type: 'question' | 'answer';
    target_id: number;
    created_at: Date;
}

export interface Vote {
    id: number;
    user_id: number;
    target_type: 'question' | 'answer';
    target_id: number;
    vote_type: -1 | 1;
    created_at: Date;
}