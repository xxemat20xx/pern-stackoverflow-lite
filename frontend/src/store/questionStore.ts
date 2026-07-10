import { create } from 'zustand';
import api from '../api/axios';

// Type for Question match with backend
export interface Question {
    id: string;
    title: string;
    body: string;
    author_id: number;
    username: string; //joined from user table
    answer_count: number; //aggregated from answers table
    created_at: string;

}

interface QuestionState {
    questions: Question[];
    isLoading: boolean;
    error: string | null;
    currentQuestion: Question | null;
    fetchQuestions: () => Promise<void>;
    fetchQuestionById: (id: number) => Promise<void>;
    createQuestion: (title: string, body: string) => Promise<{ success: boolean; error?: string }>;
}

const useQuestionStore = create<QuestionState>((set) => ({
    // initial state
    questions: [],
    isLoading: false,
    error: null,
    currentQuestion: null,

    fetchQuestions: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get<Question[]>('/questions');
            set({ questions: res.data, isLoading: false })
        } catch (error) {
            set({ error: error.response?.data?.error || 'Failed to load questions', isLoading: false });
        }
    },

    createQuestion: async (title, body) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post<Question>('/questions', { title, body });
            // add the new question on top of the list
            set((state) => ({
                questions: [res.data, ...state.questions],
                isLoading: false
            }))
            return { success: true }
        } catch (error) {
            set({ error: error.response?.data?.error || 'Failed to create question', isLoading: false });
            return { success: false, error: error.response?.data?.error || 'Failed to create question' };
        }
    },
    fetchQuestionById: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get<Question>(`/questions/${id}`);
            set({ currentQuestion: res.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.response?.data?.error || 'Failed to load question', isLoading: false });
        }
    }
}));

export default useQuestionStore;