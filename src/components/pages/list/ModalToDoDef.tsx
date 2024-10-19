import React, { useState } from 'react';
import CloseIcon from '@/assets/icons/ic_x2.svg';
import Image from 'next/image';
import Kebab from '@/assets/icons/ic_kebab.svg';
import UnCheck from '@/assets/icons/ic_uncheck.svg';
import Check from '@/assets/icons/ic_check.svg';
import ModalPortal from '@/components/ModalPortal/ModalPortal';
import { useModalToDoDefStore } from '@/store/useModalToDoDefStore';
import AnswerCard from './AnswerCard';

interface ModalProps {
  onClose: () => void;
  title?: string;
}

export default function ModalToDoDef({ onClose, title }: ModalProps) {
  const { closeModal: closeToDoDefModal } = useModalToDoDefStore();

  // 완료 상태 관리 (초기 값은 false)
  const [isCompleted, setIsCompleted] = useState(false);

  // 완료 상태 토글 함수
  const handleToggleComplete = () => {
    setIsCompleted((prev) => !prev);
  };

  return (
    <ModalPortal onClose={closeToDoDefModal}>
      <div className="border-1 flex h-[752px] w-[375px] flex-col items-center border border-border-primary bg-background-secondary p-4 md:h-[1073px] md:w-[435px] md:p-6 lg:h-[1019px] lg:w-[779px] lg:p-10">
        <button onClick={closeToDoDefModal} className="mb-2 ml-auto">
          <Image src={CloseIcon} alt="CloseIcon" width={24} height={24} />
        </button>
        <div className="flex w-full justify-between">
          <span className="text-xl-bold text-text-primary">{title}</span>
          <Image src={Kebab} alt="케밥" width={24} height={24} />
        </div>
        <div>
          <textarea></textarea>
          <AnswerCard />
        </div>

        <button
          onClick={handleToggleComplete}
          className={`text-lg-semibold h- 10 w-[111px] rounded-[40px] shadow-xl ${isCompleted ? 'border-1 border border-brand-primary bg-background-inverse' : 'bg-brand-primary'} flex items-center justify-center space-x-2 text-center`}
        >
          <Image
            src={isCompleted ? UnCheck : Check}
            alt={isCompleted ? '언체크' : '체크'}
            width={16}
            height={16}
          />
          <span>{isCompleted ? '완료 취소하기' : '완료하기'}</span>
        </button>
      </div>
    </ModalPortal>
  );
}
