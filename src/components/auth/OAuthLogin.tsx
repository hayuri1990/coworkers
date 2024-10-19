import { useState } from 'react';
import { ClientSafeProvider, getProviders, signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import googleLogo from '@/assets/icons/googleLogo.svg';
import kakaotalkLogo from '@/assets/icons/kakaotalkLogo.svg';

interface OAuthLoginOptionsProps {
  label: string;
  isItemsCenter?: boolean;
}

export default function OAuthLoginOptions({
  label,
  isItemsCenter = false,
}: OAuthLoginOptionsProps) {
  const [providers, setProviders] = useState<Record<
    string,
    ClientSafeProvider
  > | null>(null);

  const handleSocialLoginClick = async (providerId: string) => {
    // providers가 없으면 getProviders로 가져오기
    if (!providers) {
      const res = await getProviders();
      setProviders(res);

      // providers 설정 전 다음 코드로 넘어가지 않도록, getProviders 완료 후 다시 providers 확인
      if (res && res[providerId]) {
        signIn(providerId, {
          redirect: true,
          callbackUrl: process.env.KAKAO_REDIRECT_URI,
        });
      }
    } else {
      // providers가 이미 존재하는 경우 바로 로그인 처리
      if (providers[providerId]) {
        signIn(providerId, { redirect: true, callbackUrl: '/' });
      }
    }
  };

  return (
    <div className="flex w-85.75-custom flex-col items-center gap-4 md:w-115-custom lg:w-115-custom">
      <div className="flex w-full items-center text-text-primary">
        <div className="h-px flex-grow bg-border-tertiary"></div>
        <span className="text-lg-regular mx-6 text-text-inverse">OR</span>
        <div className="h-px flex-grow bg-border-tertiary"></div>
      </div>
      <div
        className={`flex w-full ${isItemsCenter ? 'items-center' : ''} justify-between`}
      >
        <span className="text-lg-medium text-text-inverse">{label}</span>
        <div className="flex gap-4">
          <Link
            href="#"
            onClick={async (e) => {
              e.preventDefault();
              await handleSocialLoginClick('google');
            }}
          >
            <Image
              src={googleLogo}
              width={42}
              height={42}
              alt="구글 로그인하기"
            />
          </Link>
          <Link
            href="#"
            onClick={async (e) => {
              e.preventDefault();
              await handleSocialLoginClick('kakao');
            }}
          >
            <Image
              src={kakaotalkLogo}
              width={42}
              height={42}
              alt="카카오 로그인하기"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
