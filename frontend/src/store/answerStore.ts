import { create } from 'zustand';
import api from '../api/axios';

export interface Answer {
    id: number;
    body: string;
    question_id: number;
    author_id: number;
    username: string;
    is_accepted: boolean;
    created_at: string;
}

interface AnswerState {
    answers: Answer[];
    isLoading: boolean;
    error: string | null;
    fetchAnswers: (questionId: number) => Promise<void>;
    createAnswer: (questionId: number, body: string, username?: string) => Promise<{ success: boolean; error?: string }>;
    acceptAnswer: (questionId: number, answerId: number) => Promise<{ success: boolean; error?: string }>;
}

// ✅ Use (set, get) to access other actions
const useAnswerStore = create<AnswerState>((set, get) => ({
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

    acceptAnswer: async (questionId: number, answerId: number) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.put<Answer>(`/questions/${questionId}/answers/${answerId}/accept`);
            set((state) => ({
                answers: state.answers.map((ans) =>
                    ans.id === answerId ? res.data : { ...ans, is_accepted: false }
                ),
                isLoading: false
            }));
            return { success: true };
        } catch (error: any) {
            // ✅ Extract the exact error from the backend response
            const message = error.response?.data?.error || 'Failed to accept answer';
            alert(message); // This will now say "This question already has an accepted answer..."
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    }
}));

export default useAnswerStore;