import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Kebab from '@/assets/icons/ic_kebab.svg';
import { useModalToDoStore } from '@/store/useModalToDoStore';

interface ListCardDropdownProps {
  onEdit: (taskId: number) => void; // 수정할 작업 ID를 받도록 변경
  onDelete: (taskId: number) => void;
  onSelectOption: (option: string) => void; // 타입 수정
  taskId: number; // 추가: 작업 ID를 props로 받음
}

export default function ListCardDropdown({
  onSelectOption,
  onEdit,
  onDelete,
  taskId,
}: ListCardDropdownProps) {
  const [isListCardDropdownOpen, setIsListCardDropdownOpen] = useState(false);
  const ListCardRef = useRef<HTMLDivElement>(null);
  const options = ['수정하기', '삭제하기'];

  const { openModal: openToDoModal } = useModalToDoStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ListCardRef.current &&
        !ListCardRef.current.contains(event.target as Node)
      ) {
        setIsListCardDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: string) => {
    setIsListCardDropdownOpen(false);

    onSelectOption(option); // 수정할 작업의 옵션을 전달
    if (option === '수정하기') {
      openToDoModal(); // 모달 열기
      onEdit(taskId); // 수정할 작업 ID를 전달
    } else {
      onDelete(taskId);
    }
  };

  return (
    <div className="relative" ref={ListCardRef}>
      <button
        onClick={() => {
          setIsListCardDropdownOpen((prev) => !prev);
        }}
      >
        <Image src={Kebab} alt="케밥" width={16} height={16} />
      </button>
      {/* 드롭다운 메뉴 */}
      {isListCardDropdownOpen && (
        <div className="text-md-regular absolute right-0 z-50 w-[117px] rounded-xl border border-solid border-[#F8FAFC] border-opacity-10 bg-background-secondary text-center text-text-primary shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              className="w-full cursor-pointer p-2 hover:rounded-xl hover:bg-[#18212F]"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
