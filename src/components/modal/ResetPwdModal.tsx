import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EMAIL_SCHEMA } from '@/utils/schema';
import { Email } from '@/types/auth';
import { publicAxiosInstance } from '@/app/api/auth/axiosInstance';
import { useModalStore } from '@/store/useModalStore';
import { ModalProps } from '@/types/modal';
import FormField from '@/components/auth/FormField';
import { useResetPwdToastStore } from '@/store/useToastStore';
import Toast from '../toast/Toast';

export default function ResetPwdModal({
  title,
  description,
  input = true,
}: ModalProps) {
  const { closeModal } = useModalStore();

  const {
    toastVisible,
    toastMessage,
    toastType,
    openToast,
    closeToast,
    setLoading,
  } = useResetPwdToastStore();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = useForm<Email>({
    resolver: yupResolver(EMAIL_SCHEMA),
    mode: 'onChange',
  });

  const sendResetLink = async (data: Email) => {
    setLoading(true);

    try {
      const result = await publicAxiosInstance.post(
        '/user/send-reset-password-email',
        {
          email: data.email,
          redirectUrl: process.env.NEXTAUTH_URL,
        },
      );
      if (result.status === 200) {
        openToast('이메일을 전송했습니다.', 'success');
        setTimeout(() => {
          closeModal?.();
          closeToast();
        }, 1500);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        openToast('등록되지 않은 이메일입니다.', 'error');
      } else {
        openToast('이메일 전송에 실패했습니다.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center px-9 pt-8">
      <span className="md:text-lg-medium lg:text-lg-medium mb-2 text-text-primary">
        {title}
      </span>
      <span className="md:text-md-medium lg:text-md-medium mb-4 text-text-secondary">
        {description}
      </span>
      {input && (
        <FormField
          id="email"
          type="email"
          placeholder="이메일을 입력해주세요."
          register={register}
          error={errors['email']}
          className="mb-6 w-70-custom"
        />
      )}
      <div className="text-lg-semibold relative flex h-12 w-full gap-2">
        <button
          className="right-4 top-4 w-full rounded-xl border border-solid border-brand-primary bg-background-inverse px-4 py-2 text-brand-primary"
          onClick={closeModal}
        >
          닫기
        </button>
        <button
          onClick={handleSubmit(sendResetLink)}
          disabled={isSubmitting || !isValid}
          className={`right-4 top-4 w-full rounded-xl px-4 py-2 text-background-inverse ${isSubmitting ? 'bg-interaction-normal' : 'bg-brand-primary'} ${!isValid ? 'cursor-not-allowed bg-text-default opacity-50' : ''}`}
        >
          {isSubmitting ? '전송 중' : '링크 보내기'}
        </button>
      </div>

      {/* 토스트가 화면에 나타날 조건 */}
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
