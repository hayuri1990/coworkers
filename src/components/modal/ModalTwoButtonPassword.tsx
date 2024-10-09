import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RESET_PASSWORD_MODAL_SCHEMA } from '@/utils/schema';
import { ResetPasswordModal } from '@/types/auth';
import FormField from '@/components/auth/FormField';
import { authAxiosInstance } from '@/app/api/auth/axiosInstance';
import { resetPasswordFieldData } from '@/hooks/formFieldData';
import { useUserSettingToastStore } from '@/store/useToastStore';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  accessToken: string;
}

const ModalTwoButtonPassword = ({
  isOpen,
  onClose,
  accessToken,
}: ModalProps) => {
  if (!isOpen) return null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordModal>({
    resolver: yupResolver(RESET_PASSWORD_MODAL_SCHEMA),
    mode: 'onChange',
  });

  // 토스트
  const { openToast, closeToast } = useUserSettingToastStore();

  useEffect(() => {
    closeToast();
  }, [closeToast]);

  // 비밀번호 변경하기
  const resetPasswordFields = resetPasswordFieldData();

  async function handleChangePwd(data: ResetPasswordModal) {
    try {
      const response = await authAxiosInstance.patch(
        '/user/password',
        {
          password: data.password,
          passwordConfirmation: data.passwordConfirmation,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      openToast('비밀번호가 변경되었습니다.', 'success');
      setTimeout(() => {
        onClose?.();
      }, 500);
      setTimeout(() => {
        closeToast();
      }, 2500);
    } catch (error: any) {
      openToast('비밀번호 변경에 실패했습니다.', 'error');
    }
  }

  return (
    <div className="mx-auto mt-4 flex w-[280px] flex-col items-center justify-between">
      <div className="flex w-full flex-col justify-between">
        <span className="text-lg-medium mb-4 flex flex-col justify-between text-center">
          비밀번호 변경하기
        </span>
        {resetPasswordFields.map((field) => (
          <div key={field.id} className="flex flex-col gap-2">
            <label
              htmlFor={field.id}
              className="text-lg-medium text-text-primary"
            >
              {field.id === 'password' ? '새 비밀번호' : '비밀번호 확인'}
            </label>
            <FormField
              key={field.id}
              {...field}
              register={register}
              error={errors[field.id as keyof ResetPasswordModal]}
              className="mb-4 w-70-custom"
              placeholder={
                field.id === 'password'
                  ? '새 비밀번호를 입력해주세요'
                  : '새 비밀번호를 다시 입력해주세요'
              }
            />
          </div>
        ))}
      </div>
      <div className="text-lg-semibold flex h-12 w-full justify-between">
        <button
          className="px-auto py-auto w-[136px] rounded-xl bg-background-inverse text-brand-primary"
          onClick={onClose}
        >
          닫기
        </button>
        <button
          className="px-auto py-auto w-[136px] rounded-xl border border-brand-primary bg-brand-primary"
          onClick={handleSubmit(handleChangePwd)}
        >
          변경하기
        </button>
      </div>
    </div>
  );
};

export default ModalTwoButtonPassword;
