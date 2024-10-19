import { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { publicAxiosInstance } from '@/app/api/auth/axiosInstance';
import KakaoProvider from 'next-auth/providers/kakao';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';

export const getOptions = (req: Request): NextAuthOptions => ({
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
          // grant_type: 'authorization_code',
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
    maxAge: 60 * 60 * 1,
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async signIn(params) {
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

        console.log(222, 'idToken', idToken);
        console.log(222, 'state', state);

        if (idToken) {
          try {
            console.log('API 호출 시도');
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

        console.log('token', token);
        return token;
      }

      // 토큰 갱신
      if (token.accessToken && token.refreshToken) {
        const currentTime = Math.floor(Date.now() / 1000);
        let accessTokenExpired = Math.floor(token.accessTokenExpires / 1000);
        const timeRemaining = accessTokenExpired - 60 * 10 - currentTime;

        if (timeRemaining > 1) {
          // 유효기간 내에는 토큰 그대로 반환
          return token;
        } else {
          // accessToken이 만료된 경우 갱신
          try {
            console.log('토큰 갱신 API 호출 시도중');

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
      session.error = token.error as any;
      session.accessTokenExpires = token.accessTokenExpires as any;
      console.log('@@@session', session);

      return session;
    },
  },
});
