'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Login } from '@/types/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { LOGIN_SCHEMA } from '@/utils/schema';
import FormField from '@/components/auth/FormField';
import Link from 'next/link';
import { loginFieldData } from '@/hooks/formFieldData';
import { useModalStore } from '@/store/useModalStore';
import ModalWrapper from '@/components/modal/ModalWrapper';
import ResetPwdModal from '@/components/modal/ResetPwdModal';
import { loginStore } from '@/store/loginStore';
import { useRouter } from 'next/navigation';
import OAuthLoginOptions from '@/components/auth/OAuthLogin';
import useSessionStore from '@/store/useSessionStore';
import { useLoginToastStore } from '@/store/useToastStore';
import Toast from '@/components/toast/Toast';

export default function LoginPage() {
  const loginFields = loginFieldData();

  // 세션 존재 시 홈 화면으로 리다이렉트
  const router = useRouter();

  // Zustand에서 세션 가져오기
  const { user, accessToken } = useSessionStore((state) => state);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = useForm<Login>({
    resolver: yupResolver(LOGIN_SCHEMA),
    mode: 'onChange',
  });

  // error 메시지 여부 확인
  const hasErrors = Object.keys(errors).length > 0;

  // 로그인
  const { setEmail, setPassword, signInUser } = loginStore();

  // 모달
  const { openModal } = useModalStore();

  // 토스트
  const { toastVisible, toastMessage, toastType, openToast, closeToast } =
    useLoginToastStore();

  const onSubmit = async (data: Login) => {
    setEmail(data.email);
    setPassword(data.password);

    const result = await signInUser();

    if (result?.ok) {
      openToast(`${user?.nickname}님, 환영합니다.`, 'success');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } else {
      openToast('로그인에 실패했습니다.', 'error');
    }
  };

  useEffect(() => {
    if (user && accessToken) {
      openToast(`${user.nickname}님, 환영합니다.`, 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  }, [user, accessToken]);

  return (
    <div
      className={`mt-6 flex flex-col items-center lg:mt-35-custom ${hasErrors ? 'md:mt-30-custom' : 'md:mt-25-custom'} ${hasErrors ? 'gap-6.5-custom md:gap-11.25-custom lg:gap-12.25-custom' : 'gap-6.25-custom md:gap-12.25-custom lg:gap-12'} `}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-85.75-custom flex-col gap-10 md:w-115-custom lg:w-115-custom"
      >
        <div>
          <p className="text-2xl-medium md:text-2xl-medium mb-6 text-center text-text-primary md:mb-20 lg:mb-20 lg:text-4xl">
            로그인
          </p>
          <div className="flex flex-col gap-6">
            {loginFields.map((field) => (
              <div key={field.id} className="flex flex-col gap-3">
                <label
                  htmlFor={field.id}
                  className="text-lg-medium text-text-primary"
                >
                  {field.id === 'email' ? '이메일' : '비밀번호'}
                </label>
                <FormField
                  key={field.id}
                  {...field}
                  register={register}
                  error={errors[field.id as keyof Login]}
                />
              </div>
            ))}
          </div>
          <Link
            href="#"
            className="text-md-medium-alt md:text-lg-medium-alt lg:text-lg-medium-alt mt-3 flex flex-col text-end text-brand-primary underline"
            onClick={(e) => {
              e.preventDefault();
              openModal();
            }}
          >
            비밀번호를 잊으셨나요?
          </Link>
          <ModalWrapper>
            <ResetPwdModal
              title="비밀번호 재설정"
              description="비밀번호 재설정 링크를 보내드립니다."
              input={true}
              inputPlaceholder="이메일을 입력하세요."
              closeBtn
            />
          </ModalWrapper>
        </div>
        <div className="flex flex-col gap-6">
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={`text-lg-semibold rounded-xl bg-brand-primary py-3.5 text-text-primary ${
              !isValid ? 'cursor-not-allowed bg-text-default opacity-50' : ''
            }`}
          >
            로그인
          </button>
          <div className="text-md-medium md:text-lg-medium lg:text-lg-medium flex justify-center gap-3">
            <span className="text-text-primary">아직 계정이 없으신가요?</span>
            <Link href="/signup" className="text-status-brand underline">
              가입하기
            </Link>
          </div>
        </div>
      </form>
      <OAuthLoginOptions label="간편 로그인하기" isItemsCenter={false} />

      {/* Toast 렌더링 */}
      {toastVisible && (
        <Toast
          message={toastMessage}
          type={toastType}
          closeToast={closeToast}
        />
      )}
    </div>
  );
}
