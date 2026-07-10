import { create } from 'zustand';
import api from '../api/axios';

// Type for an Answer from your backend
export interface Answer {
    id: number;
    body: string;
    question_id: number;
    author_id: number;
    username: string;   // joined from users table
    is_accepted: boolean;
    created_at: string;
}

interface AnswerState {
    answers: Answer[];
    isLoading: boolean;
    error: string | null;
    fetchAnswers: (questionId: number) => Promise<void>;
    createAnswer: (questionId: number, body: string, username?: string) => Promise<{ success: boolean; error?: string }>;
}

const useAnswerStore = create<AnswerState>((set) => ({
    answers: [],
    isLoading: false,
    error: null,

    fetchAnswers: async (questionId: number) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get<Answer[]>(`/questions/${questionId}/answers`);
            set({ answers: Array.isArray(res.data) ? res.data : [], isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.error || 'Failed to load answers', isLoading: false, answers: [] });
        }
    },

    createAnswer: async (questionId: number, body: string, username?: string) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post<Answer>(`/questions/${questionId}/answers`, { body });

            // ✅ Force the username into the answer object
            const newAnswer = {
                ...res.data,
                username: username || 'Unknown'
            };

            set((state) => ({
                answers: [newAnswer, ...state.answers],
                isLoading: false
            }));
            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to post answer';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },
}));

export default useAnswerStore;