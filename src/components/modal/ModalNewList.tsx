import { useState } from 'react';
import ModalPortal from '../ModalPortal/ModalPortal';
import { useModalNewListStore } from '@/store/useModalNewListStore';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  children?: React.ReactNode;
}

const ModalNewList = ({ isOpen, onClose, onSubmit }: ModalProps) => {
  const { closeModal: closeNewListModal } = useModalNewListStore();
  const [name, setName] = useState<string>('');
  if (!isOpen) return null;

  const handleCreate = () => {
    onSubmit(name); // onSubmit으로 name 전달
    setName('');
    onClose(); // 모달 닫기
  };

  return (
    <ModalPortal onClose={closeNewListModal}>
      <div className="flex items-end justify-center md:items-center lg:items-center">
        <div className="relative flex h-[304px] w-[375px] rounded-b-[0px] rounded-t-xl bg-background-secondary md:w-96 md:rounded-xl lg:w-96 lg:rounded-xl">
          <div className="mx-auto mb-8 mt-12 flex w-[280px] flex-col items-center justify-between">
            <div className="flex h-[152px] w-full flex-col justify-between">
              <div className="flex h-[61px] flex-col justify-between">
                <h2 className="text-lg-medium text-center text-text-primary">
                  새로운 목록 추가
                </h2>
                <div className="text-md-medium whitespace-normal break-words text-center text-text-secondary">
                  할 일에 대한 목록을 추가하고
                  <br />
                  목록별 할 일을 만들 수 있습니다.
                </div>
              </div>
              <div className="flex h-[75px] w-full flex-col justify-between">
                <h2 className="text-lg-medium text-text-primary">목록 이름</h2>
                <input
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  className="placeholder:text-lg-regular h-12 rounded-xl border border-solid border-border-primary bg-background-secondary p-4 placeholder:text-text-default focus:border-none focus:outline-none focus:ring-1 focus:ring-[#F8FAFC]"
                  placeholder="목록 이름을 입력해주세요."
                />
              </div>
            </div>
            <button
              className="px-auto py-auto h-12 w-full rounded-xl bg-brand-primary text-text-inverse"
              onClick={handleCreate}
            >
              만들기
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};
export default ModalNewList;
