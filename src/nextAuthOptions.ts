import { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { publicAxiosInstance } from '@/app/api/auth/axiosInstance';
import KakaoProvider from 'next-auth/providers/kakao';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';

export const getOptions = (req?: Request): NextAuthOptions => ({
  debug: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const result = await publicAxiosInstance.post('/auth/signIn', {
            email: credentials?.email,
            password: credentials?.password,
          });

          const user = result.data;

          if (user) {
            return {
              ...user,
              accessTokenExpires: Date.now() + 60 * 60 * 1 * 1000,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      authorization: {
        params: {
          redirect_uri: process.env.KAKAO_REDIRECT_URI,
          response_type: 'code',
          scope: 'profile_nickname, profile_image',
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          response_type: 'code',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 1,
    updateAge: 60 * 60 * 1,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 1,
  },
  pages: {
    signIn: '/login',
    signOut: '/',
  },
  callbacks: {
    async redirect({ baseUrl }) {
      return `${baseUrl}/login`;
    },
    async signIn(params) {
      console.log('signIn callback 호출됨', params);

      // 구글 로그인
      if (params.account?.provider === 'google') {
        if (!req?.url) {
          console.error('req.url is not defined');
          return false;
        } else {
          const parseUrl = new URL(req.url);
          const searchParams = new URLSearchParams(parseUrl.search);
          const state = searchParams.get('state');

          params.account.state = state;
          const idToken = params.account?.id_token;
          params.account.id_token = idToken;

          return true;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // 구글 로그인
      if (account?.provider === 'google') {
        token = { ...token };

        const idToken = account.id_token;
        const state = account.state;

        if (idToken) {
          try {
            const signInResponse = await publicAxiosInstance.post(
              '/auth/signIn/GOOGLE',
              {
                state: state,
                redirectUri: process.env.GOOGLE_REDIRECT_URI,
                token: idToken,
              },
            );
            const newTokens = signInResponse.data;

            // JWT에 필요한 토큰 정보 추가
            token.user = newTokens.user;
            token.accessToken = newTokens.accessToken;
            token.refreshToken = newTokens.refreshToken;
            token.accessTokenExpires =
              Math.floor(new Date().getTime()) + 60 * 60 * 1 * 1000;

            return token;
          } catch (error) {
            console.log('Google 로그인 API 호출 실패', error);
            return {
              ...token,
              error: 'Google 로그인 API 호출 실패',
            };
          }
        } else {
          return {
            ...token,
            error: 'Missing ID Token',
          };
        }
      }

      // 최초 로그인
      if (user) {
        token = { ...token, ...user };

        // 불필요한 속성 제거
        delete token.name;
        delete token.email;
        delete token.picture;
        delete token.sub;

        return token;
      }

      // 토큰 갱신
      if (token.accessToken && token.refreshToken) {
        const currentTime = Math.floor(Date.now() / 1000);
        let accessTokenExpired = Math.floor(token.accessTokenExpires / 1000);
        const timeRemaining = accessTokenExpired - 60 * 10 - currentTime;

        if (timeRemaining > 1) {
          return token;
        } else {
          // Access Token이 만료된 경우 갱신
          try {
            const response = await publicAxiosInstance.post(
              '/auth/refresh-token',
              {
                refreshToken: token.refreshToken,
              },
            );
            const newTokens = response.data;
            token.accessToken = newTokens.accessToken;
            token.accessTokenExpires = Date.now() + 60 * 60 * 1 * 1000;

            console.log('토큰 갱신 성공', token);

            return token;
          } catch (error) {
            console.log('토큰 갱신 실패: ', error);
            return {
              ...token,
              error: 'RefreshAccessTokenError',
            };
          }
        }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = token.user as any;
      session.accessToken = token.accessToken as any;
      session.accessTokenExpires = token.accessTokenExpires as any;
      session.error = token.error as any;

      return session;
    },
  },
});
