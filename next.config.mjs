/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'sprint-fe-project.s3.ap-northeast-2.amazonaws.com',
      'k.kakaocdn.net', // 카카오 프로필 이미지
      'img1.kakaocdn.net', // 카카오 기본 프로필 이미지
      'example.com',
      'lh3.googleusercontent.com',
      'hips.hearstapps.com',
    ],
  },
};

export default nextConfig;
