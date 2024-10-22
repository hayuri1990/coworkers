import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { authAxiosInstance } from '@/app/api/auth/axiosInstance'; // axios instance for API requests

export { default } from 'next-auth/middleware';

// 로그인 상태에서만 볼 수 있는 페이지
export const config = {
  matcher: [
    '/teampage/:id*',
    '/addteam/:path*',
    '/{teamid}/:path*',
    '/mypage/:path*',
    '/addboard/:path*',
  ],
};

export async function middleware(req: NextRequest) {
  // JWT 토큰 가져오기
  const token = await getToken({ req });
  console.log('JWT Token:', token);

  // 사용자가 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 요청 경로에서 groupId 추출 (e.g., teampage/{groupId})
  const url = req.nextUrl.clone();
  const pathSegments = url.pathname.split('/');

  // 경로가 '/teampage/{groupId}' 형태인지 확인
  if (pathSegments.length >= 3 && pathSegments[1] === 'teampage') {
    const groupId = pathSegments[2]; // teampage/{groupId}에서 groupId 추출
    console.log('Extracted groupId:', groupId);

    // groupId가 없을 경우 '/no-access'로 리다이렉트
    if (!groupId) {
      console.error('groupId가 경로에서 추출되지 않았습니다.');
      return NextResponse.redirect(new URL('/no-access', req.url));
    }

    try {
      // 사용자의 소속된 그룹 데이터 가져오기 (토큰을 사용해 API 호출)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }

      const data = await response.json();
      const memberships = data.memberships;
      console.log('User memberships:', memberships);

      // 사용자가 소속된 그룹 중에 해당 groupId가 있는지 확인
      const isGroupMember = memberships.some(
        (membership: any) => membership.group.id === Number(groupId),
      );

      // 사용자가 소속되지 않은 그룹에 접근하면 '/no-access'로 리다이렉트
      if (!isGroupMember) {
        console.warn('사용자가 소속되지 않은 그룹에 접근하려고 했습니다.');
        return NextResponse.redirect(new URL('/no-access', req.url));
      }
    } catch (error: any) {
      console.error('사용자 그룹 정보를 가져오는 중 오류 발생:', error);

      // 특정 에러 메시지나 상태 코드에 따른 처리
      if (error.response) {
        const statusCode = error.response.status;
        if (statusCode === 401) {
          console.error('인증 오류: 토큰이 유효하지 않음');
          return NextResponse.redirect(new URL('/login', req.url));
        } else if (statusCode === 403) {
          console.error('접근 권한 없음');
          return NextResponse.redirect(new URL('/no-access', req.url));
        } else if (statusCode === 500) {
          console.error('서버 오류');
          return NextResponse.redirect(new URL('/error', req.url));
        }
      }

      // 그 외의 경우 '/no-access'로 리다이렉트
      return NextResponse.redirect(new URL('/no-access', req.url));
    }
  }
}

// 해당 경로가 아닌 경우 요청을 계속 처리
