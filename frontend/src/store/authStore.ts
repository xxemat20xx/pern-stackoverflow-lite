import { create } from 'zustand';
import api from '../api/axios';

export interface User {
    id: number;
    username: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    hasCheckedAuth: boolean;
    error: string | null;

    register: (
        username: string,
        email: string,
        password: string,
    ) => Promise<{ success: boolean; error?: string }>;

    login: (
        email: string,
        password: string,
    ) => Promise<{ success: boolean; error?: string }>;

    logout: () => Promise<void>;
    checkUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    hasCheckedAuth: false,
    error: null,

    register: async (username, email, password) => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            const res = await api.post<User>('/auth/register', {
                username,
                email,
                password,
            });

            set({
                user: res.data,
                isLoading: false,
                hasCheckedAuth: true,
            });

            return { success: true };
        } catch (error: any) {
            const message =
                error.response?.data?.error || 'Registration failed.';

            set({
                error: message,
                isLoading: false,
                hasCheckedAuth: true,
            });

            return {
                success: false,
                error: message,
            };
        }
    },

    login: async (email, password) => {
        set({
            isLoading: true,
            error: null,
        });

        try {
            const res = await api.post<User>('/auth/login', {
                email,
                password,
            });

            set({
                user: res.data,
                isLoading: false,
                hasCheckedAuth: true,
            });

            return { success: true };
        } catch (error: any) {
            const message =
                error.response?.data?.error || 'Login failed.';

            set({
                error: message,
                isLoading: false,
                hasCheckedAuth: true,
            });

            return {
                success: false,
                error: message,
            };
        }
    },

    checkUser: async () => {
        try {
            const res = await api.get<User>('/auth/me');

            set({
                user: res.data,
                hasCheckedAuth: true,
            });
        } catch {
            set({
                user: null,
                hasCheckedAuth: true,
            });
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');

            set({
                user: null,
                error: null,
                hasCheckedAuth: true,
            });
        } catch (error: any) {
            const message =
                error.response?.data?.error || 'Logout failed.';

            set({
                error: message,
                isLoading: false,
            });
        }
    },
}));

export default useAuthStore;