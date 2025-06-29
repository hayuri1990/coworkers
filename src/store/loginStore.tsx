import { create } from 'zustand';
import { signIn } from 'next-auth/react';

interface LoginState {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  error: string | null;
  signInUser: () => Promise<any>;
}

export const loginStore = create<LoginState>((set) => ({
  email: '',
  setEmail: (email: string) => set({ email }),
  password: '',
  setPassword: (password: string) => set({ password }),
  isLoading: false,
  error: null,
  signInUser: async (): Promise<boolean> => {
    // 로그인 로직
    try {
      const { email, password } = loginStore.getState();

      const response = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      return response?.ok ?? false;
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);

      return false;
    }
  },
}));
