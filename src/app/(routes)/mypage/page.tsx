'use client';

import ImageInput from '@/components/pages/teamcreate/ImageInput';
import IcExit from '@/assets/icons/ic_secession.svg';
import Image from 'next/image';
import useSessionStore from '@/store/useSessionStore';
import useUser from '@/hooks/useUser';
import ChangePassword from '@/components/modal/ModalTwoButtonPassword';
import DeleteAccountModal from '@/components/modal/ModalDanger';
import ModalWrapper from '@/components/modal/ModalWrapper';
import { useModalStore } from '@/store/useModalStore';
import { authAxiosInstance } from '@/app/api/auth/axiosInstance';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Toast from '@/components/toast/Toast';
import {
  useReviseMyDataToastStore,
  useUserSettingToastStore,
} from '@/store/useToastStore';
import { loginStore } from '@/store/loginStore';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';

interface IFormData {
  nickname: string;
  image: string | null | undefined;
}

export default function Page() {
  const router = useRouter();
  const { user, accessToken } = useSessionStore();
  // 모달
  const {
    isSecondModalOpen,
    openSecondModal,
    closeSecondModal,
    isThirdModalOpen,
    openThirdModal,
    closeThirdModal,
  } = useModalStore();

  // 토스트
  const { toastVisible, toastMessage, toastType, openToast, closeToast } =
    useUserSettingToastStore();

  const { toast2Visible, toast2Message, toast2Type, openToast2, closeToast2 } =
    useReviseMyDataToastStore();

  // 비밀번호 변경
  const { password } = loginStore();
  console.log('@@@password', password);

  // 회원 탈퇴
  async function handleAccountDeletion() {
    try {
      await authAxiosInstance.delete('/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('회원 탈퇴 성공');
      openToast('성공적으로 탈퇴되었습니다.', 'success');
      setTimeout(() => {
        closeThirdModal?.();
      }, 500);
      setTimeout(() => {
        signOut({ callbackUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL });
        router.push('/');
      }, 2500);
    } catch (error) {
      console.log('회원 탈퇴 실패', error);
      openToast('탈퇴에 실패했습니다.', 'error');
    }
  }

  // 도메인 확인
  const checkDomain = (email: string | undefined): boolean => {
    if (!email) return false;
    const domain = email.split('@')[1];
    return /^(KAKAO|GOOGLE)/i.test(domain);
  };

  const domain = checkDomain(user?.email);

  // 이름, 이미지 수정
  const { userData } = useUser(user?.id);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormData>({
    defaultValues: {
      nickname: userData?.nickname,
      image: userData?.image,
    },
    mode: 'onChange',
  });
  const [imageUrl, setImageUrl] = useState<string | null>(
    userData?.image ?? null,
  );
  const patchMyData = useMutation({
    mutationFn: (formData: IFormData) => {
      return authAxiosInstance.patch(`/user`, formData);
    },
    onSuccess: async () => {
      console.log('회원 정보 수정 완료');
      await queryClient.invalidateQueries({ queryKey: ['getGroup'] });
      await queryClient.invalidateQueries({ queryKey: ['getUser'] });
      openToast2('회원 정보 수정 성공!', 'success');
      router.push('/mypage');
    },
    onError: (error: any) => {
      console.error('에러 발생', error);
      openToast2('회원 정보 수정 실패', 'error');
    },
  });

  const onSubmit = (data: IFormData) => {
    if (!imageUrl) {
      console.error('이미지는 필수입니다.');
      return;
    }
    const formData = {
      nickname: data.nickname,
      image: imageUrl,
    };
    patchMyData.mutate(formData);
  };

  return (
    <div className="lg: m-auto max-w-[792px]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 mt-6 flex flex-row items-center justify-between md:mt-6 lg:mt-10">
          <p className="text-2lg-bold md:text-xl-bold lg:text-xl-bold">
            계정 설정
          </p>
          <button
            type="submit"
            className={`text-sm-semibold h-8 w-[74px] rounded-[12px] bg-brand-primary px-[12.5px] py-[6px] md:top-2 lg:top-2`}
            onClick={() => openToast2}
          >
            변경하기
          </button>
        </div>
        <div className="mb-6">
          <ImageInput imageUrl={imageUrl} setImageUrl={setImageUrl} />
        </div>
        <div className="mb-6">
          <label className="text-lg-medium mb-3 block">이름</label>
          <input
            {...register('nickname', {
              required: true,
            })}
            className="text-md-regular md:text-lg-regular lg:text-lg-regular w-full rounded-[12px] border border-solid border-border-primary bg-background-secondary px-[16px] py-[13.5px] focus:border-status-brand focus:outline-none focus:ring-status-brand md:py-[14.5px] lg:py-[14.5px]"
          ></input>
        </div>
        <div className="mb-6">
          <label className="text-lg-medium mb-3 block">이메일</label>
          <input
            className="text-md-regular md:text-lg-regular lg:text-lg-regular w-full cursor-not-allowed rounded-[12px] border border-solid border-border-primary bg-background-tertiary px-[16px] py-[13.5px] text-text-disabled md:py-[14.5px] lg:py-[14.5px]"
            disabled
            placeholder={user?.email}
          />
        </div>
      </form>
      <div className="mb-6">
        <label className="text-lg-medium mb-3 block">비밀번호</label>
        <div className="relative">
          <input
            type="password"
            className="text-md-regular md:text-lg-regular lg:text-lg-regular w-full cursor-not-allowed rounded-[12px] border border-solid border-border-primary bg-background-tertiary px-[16px] py-[13.5px] text-text-disabled md:py-[14.5px] lg:py-[14.5px]"
            disabled
            value={password ? password : '!asdf1234'}
          />
          <button
            className={`text-sm-semibold absolute right-4 top-[6px] h-8 w-[74px] rounded-[12px] px-[12.5px] py-[6px] md:top-2 lg:top-2 ${!domain ? 'bg-brand-primary' : 'cursor-not-allowed bg-text-default opacity-50'}`}
            onClick={(e) => {
              e.preventDefault();
              openSecondModal?.();
            }}
            disabled={domain}
          >
            변경하기
          </button>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Image width={24} height={24} src={IcExit} alt="탈퇴 아이콘" />
        <button
          onClick={(e) => {
            e.preventDefault();
            if (openThirdModal) {
              openThirdModal();
            }
          }}
        >
          <span className="text-lg-medium text-status-danger">
            회원 탈퇴하기
          </span>
        </button>
      </div>

      {/* 비밀번호 변경 모달 */}
      {isSecondModalOpen && accessToken && (
        <ModalWrapper>
          <ChangePassword
            isOpen={true}
            onClose={closeSecondModal}
            accessToken={accessToken}
          />
        </ModalWrapper>
      )}

      {/* 회원 탈퇴 모달 */}
      {isThirdModalOpen && (
        <ModalWrapper>
          <DeleteAccountModal
            isOpen={true}
            onClose={closeThirdModal}
            onDelete={handleAccountDeletion}
          />
        </ModalWrapper>
      )}

      {/* Toast 렌더링 */}
      {toastVisible && (
        <Toast
          message={toastMessage}
          type={toastType}
          closeToast={closeToast}
        />
      )}
      {toast2Visible && (
        <Toast
          message={toast2Message}
          type={toast2Type}
          closeToast={closeToast2}
        />
      )}
    </div>
  );
}
