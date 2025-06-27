import { create } from 'zustand';

interface User {
  id: number;
  nickname: string;
  email?: string;
  image: string | null;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}

interface SessionState {
  user: User | null;
  accessToken: string | null;
  accessTokenExpires: number | null;
  setSession: (sessionData: {
    user: User | null;
    accessToken: string | null;
    accessTokenExpires: number | null;
  }) => void;
  clearSession: () => void;
}

const useSessionStore = create<SessionState>((set) => ({
  user: null,
  accessToken: null,
  accessTokenExpires: null,
  // 세션 데이터 업데이트
  setSession: (session) => {
    set((state) => ({
      ...state,
      user: session.user,
      accessToken: session.accessToken,
      accessTokenExpires: session.accessTokenExpires,
    }));
  },
  // 세션을 명시적으로 초기화
  clearSession: () => {
    set({
      user: null,
      accessToken: null,
      accessTokenExpires: null,
    });
  },
}));

export default useSessionStore;
