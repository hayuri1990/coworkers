'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { publicAxiosInstance } from '@/app/api/auth/axiosInstance';

export default function KakaoTalk() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const kakaoLoginHandler = async (
    code: string | string[],
    state: string | string[],
  ) => {
    const res = await publicAxiosInstance.post(
      `/api/auth/callback/kakao?code=${code}&state=${state}`,
    );

    const data = res.data;
    console.log('data returned from api: ', data); // 데이터 잘 받아오는지 확인용 로그
  };

  // code, state 저장
  useEffect(() => {
    if (code && state) {
      // code, state가 있을 때만 POST 요청
      kakaoLoginHandler(code, state);
    }
  }, [code]);

  return <div>page</div>;
}
