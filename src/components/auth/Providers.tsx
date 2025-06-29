'use client';

import useRefreshToken from '@/hooks/useRefreshToken';
import { SessionProvider } from 'next-auth/react';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
function Providers({ children }: Props) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <RefreshTokenWrapper>{children}</RefreshTokenWrapper>
    </SessionProvider>
  );
}

// Access Token 갱신
const RefreshTokenWrapper = ({ children }: { children: ReactNode }) => {
  useRefreshToken();

  return <>{children}</>;
};

export default Providers;
