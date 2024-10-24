import { publicAxiosInstance } from '@/app/api/auth/axiosInstance';
import { NextResponse, NextRequest } from 'next/server';
import { encode } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET as string;

export async function GET(request: NextRequest) {
  console.log('Kakao callback route hit'); // 파일 호출 확인

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // 디버깅
  console.log('@@@code', code);
  console.log('@@@state', state);

  if (code) {
    try {
      const response = await publicAxiosInstance.post('/auth/signIn/KAKAO', {
        state: state,
        redirectUri: process.env.KAKAO_REDIRECT_URI,
        token: code,
      });

      const userData = response.data;
      console.log('@@@userData', userData);

      // 쿠키에 JWT 토큰 존재여부 확인
      const existingCookie = request.cookies.get('next-auth.session-token');
      console.log('@@@existingCookie', existingCookie);

      const currentTime = Math.floor(new Date().getTime()); // UNIX 타임스탬프
      const accessTokenExpires = currentTime + 60 * 60 * 1 * 1000;

      if (existingCookie) {
        console.log('기존 쿠키가 이미 존재합니다.');
        return NextResponse.redirect(new URL('/', request.url));
      } else {
        const token = {
          user: userData.user,
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
          accessTokenExpires: accessTokenExpires,
        };

        // JWT 토큰 암호화
        const encodedToken = await encode({ token, secret });
        console.log('새 JWT 토큰: ', encodedToken);

        // 리다이렉트 응답 생성
        const nextResponse = NextResponse.redirect(
          new URL('/login', request.url),
        );

        // 생성된 JWT 토큰을 쿠키에 저장
        nextResponse.cookies.set(
          '__Secure-next-auth.session-token',
          encodedToken,
          {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
          },
        );
        console.log('JWT 토큰이 쿠키에 저장되었습니다.');
        return nextResponse;
      }
    } catch (error) {
      console.error('API 호출 실패', error);
      return NextResponse.json(
        { success: false, error: 'API 호출 실패' },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json(
      { success: false, error: 'code가 제공되지 않았습니다.' },
      { status: 400 },
    );
  }
}
