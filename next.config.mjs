/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
      'k.kakaocdn.net',
      'example.com',
      'lh3.googleusercontent.com',
      'hips.hearstapps.com',
    ],
  },
  env: {
    KAKAO_REDIRECT_URI: process.env.KAKAO_REDIRECT_URI,
  },
};

export default nextConfig;
