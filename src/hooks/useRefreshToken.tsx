import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

export default function useRefreshToken() {
  const { data: session, update } = useSession();

  const interval = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (interval.current) {
      clearInterval(interval.current);
    }

    // 토큰 만료 여부를 주기적으로 확인하고 갱신 시도
    const watchAndUpdateIfExpire = async () => {
      if (session) {
        const currentTime = Math.floor(new Date().getTime() / 1000);
        const accessTokenExpires = Math.floor(
          session.accessTokenExpires / 1000,
        );
        const timeRemaining = accessTokenExpires - currentTime;

        if (timeRemaining <= 0) {
          try {
            update();
          } catch (error) {
            console.log('토큰 업데이트 중 에러', error);
          }
        }
      }
    };

    // 5초마다 토큰 만료 여부 체크
    interval.current = setInterval(watchAndUpdateIfExpire, 5 * 1000);

    // 컴포넌트 언마운트 시 interval 해제하여 메모리 누수를 방지
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, [session, update]);

  return null;
}
