import { create } from 'zustand';
import api from '../api/axios';

export interface Question {
    id: string;
    title: string;
    body: string;
    author_id: number;
    username: string;
    answer_count: number;
    created_at: string;
}

interface QuestionState {
    questions: Question[];
    isLoading: boolean;
    error: string | null;
    currentQuestion: Question | null;
    deletingIds: Set<number>; // ✅ track which IDs are being deleted
    fetchQuestions: () => Promise<void>;
    fetchQuestionById: (id: number) => Promise<void>;
    createQuestion: (title: string, body: string) => Promise<{ success: boolean; error?: string }>;
    updateQuestion: (id: number, title: string, body: string) => Promise<{ success: boolean; error?: string }>;
    deleteQuestionById: (id: number) => Promise<{ success: boolean; error?: string }>;
}

const useQuestionStore = create<QuestionState>((set) => ({
    questions: [],
    isLoading: false,
    error: null,
    currentQuestion: null,
    deletingIds: new Set<number>(), // ✅ init

    fetchQuestions: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get<Question[]>('/questions');
            set({ questions: res.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.error || 'Failed to load questions', isLoading: false });
        }
    },

    fetchQuestionById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get<Question>(`/questions/${id}`);
            set({ currentQuestion: res.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.error || 'Failed to load question', isLoading: false, currentQuestion: null });
        }
    },

    createQuestion: async (title, body) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post<Question>('/questions', { title, body });
            set((state) => ({
                questions: [res.data, ...state.questions],
                isLoading: false,
            }));
            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to create question';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },

    updateQuestion: async (id, title, body) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.put<Question>(`/questions/${id}`, { title, body });
            set((state) => ({
                questions: state.questions.map((q) => (Number(q.id) === id ? res.data : q)),
                currentQuestion: state.currentQuestion && Number(state.currentQuestion.id) === id ? res.data : state.currentQuestion,
                isLoading: false,
            }));
            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to update question';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },

    deleteQuestionById: async (id: number) => {
        // ✅ add ID to the deleting set
        set((state) => ({ deletingIds: new Set(state.deletingIds).add(id) }));
        try {
            await api.delete(`/questions/${id}`);
            // ✅ remove from deleting set and from the list
            set((state) => ({
                questions: state.questions.filter((q) => Number(q.id) !== id),
                currentQuestion: state.currentQuestion && Number(state.currentQuestion.id) === id ? null : state.currentQuestion,
                deletingIds: new Set(Array.from(state.deletingIds).filter((delId) => delId !== id)),
            }));
            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to delete question';
            // ✅ remove from deleting set even on error
            set((state) => ({
                error: message,
                deletingIds: new Set(Array.from(state.deletingIds).filter((delId) => delId !== id)),
            }));
            return { success: false, error: message };
        }
    },
}));

export default useQuestionStore;