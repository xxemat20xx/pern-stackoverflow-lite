import { create } from 'zustand';
import api from '../api/axios';

interface VoteCounts {
    upvotes: number;
    downvotes: number;
    total: number;
}

interface VoteState {
    isLoading: boolean;
    error: string | null;
    getVoteCounts: (targetType: 'question' | 'answer', targetId: number) => Promise<VoteCounts>;
    castVote: (targetType: 'question' | 'answer', targetId: number, voteType: 1 | -1) => Promise<{ success: boolean; error?: string }>;
    removeVote: (targetType: 'question' | 'answer', targetId: number) => Promise<{ success: boolean; error?: string }>;
}

const useVoteStore = create<VoteState>((set) => ({
    isLoading: false,
    error: null,

    getVoteCounts: async (targetType, targetId) => {
        try {
            const res = await api.get<VoteCounts>(`/votes/${targetType}/${targetId}/counts`);
            return res.data;
        } catch (error: any) {
            console.error('Failed to get vote counts');
            return { upvotes: 0, downvotes: 0, total: 0 };
        }
    },

    castVote: async (targetType, targetId, voteType) => {
        set({ isLoading: true, error: null });
        try {
            await api.post('/votes', { target_type: targetType, target_id: targetId, vote_type: voteType });
            set({ isLoading: false });
            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to cast vote';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },

    removeVote: async (targetType, targetId) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/votes/${targetType}/${targetId}`);
            set({ isLoading: false });
            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to remove vote';
            set({ error: message, isLoading: false });
            return { success: false, error: message };
        }
    },
}));

export default useVoteStore;