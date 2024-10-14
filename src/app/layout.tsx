'use client';

import React, { useEffect, useState } from 'react';
import '../styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Providers from '@/components/auth/Providers';
import useSessionStore from '@/store/useSessionStore';
import { useSession } from 'next-auth/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const session = useSessionStore((state) => state);
  return (
    <html lang="ko">
      <QueryClientProvider client={queryClient}>
        <body>
          <Providers session={session}>
            <SessionStoreUpdater />
            <main>{children}</main>
            <div id="__next"></div>
            <div id="_modal"></div>
          </Providers>
        </body>
      </QueryClientProvider>
    </html>
  );
}

// 세션을 가져와서 Zustand Store에 저장하는 컴포넌트
const SessionStoreUpdater = () => {
  const { data: session } = useSession();
  const { clearSession, setSession } = useSessionStore();

  useEffect(() => {
    if (session && session.user) {
      // 기존 세션 상태 초기화
      clearSession();

      // 새로운 세션 상태 설정
      setSession({
        user: session.user || null,
        accessToken: session.accessToken || null,
        accessTokenExpires: session.accessTokenExpires || null,
      });
    }
  }, [session, setSession]);

  return null;
};
