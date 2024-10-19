import { useState } from 'react';
import Image from 'next/image';
import Checkbox from './CheckBox';
import Comment from '@/assets/icons/comment.svg';
import Kebab from '@/assets/icons/ic_kebab.svg';
import Callender from '@/assets/icons/ic_calendar.svg';
import Repeat from '@/assets/icons/ic_repeat.svg';
import VectorIcon from '@/assets/icons/ic-vector.svg';
import { Task } from '@/types/Group';
import ListCardDropdown from './ListCardDropdown';
import ModalToDoDef from './ModalToDoDef';
import { format, parseISO } from 'date-fns';

interface ListCardProps {
  task: Task;
  onSelectOption: (option: string) => void;
  onCheckboxChange: (checked: boolean) => void;
  checked: boolean;
}

export default function ListCard({
  task,
  onSelectOption,
  onCheckboxChange,
  checked,
}: ListCardProps) {
  function formatDate(dateString: string) {
    const date = parseISO(dateString); // ISO 8601 문자열을 Date 객체로 변환
    return format(date, 'yyyy년 MM월 dd일');
  }
  if (!task) {
    return null;
  }

  return (
    <div className="h-18.5-custom relative mb-4 rounded-lg bg-background-secondary px-3.5 py-3">
      <div className="mb-2.5 flex justify-between">
        <div className="flex">
          <Checkbox onChange={onCheckboxChange} checked={checked} />
          <div
            className={
              checked
                ? 'text-md-regular my-auto ml-2 mr-3 text-text-primary line-through'
                : 'text-md-regular my-auto ml-2 mr-3 text-text-primary'
            }
          >
            {task.description}
          </div>
          {/* 데스크탑, 태블릿일 때는 comment가 원래 위치 */}
          <div className="hidden md:flex md:items-center lg:flex lg:items-center">
            <Image src={Comment} alt="Comment" width={16} height={16} />
            <div className="text-xs-regular ml-0.5 h-4 w-2 text-left text-text-default">
              {task.commentCount}
            </div>
          </div>
        </div>
        <div className="flex">
          {/* 모바일일 때는 comment가 이쪽으로 이동 */}
          <div className="mr-2 flex items-center md:hidden lg:hidden">
            <Image src={Comment} alt="Comment" width={16} height={16} />
            <div className="text-xs-regular ml-0.5 h-4 w-2 text-left text-text-default">
              {task.commentCount}
            </div>
          </div>
          <ListCardDropdown onSelectOption={onSelectOption} />
        </div>
      </div>
      <div className="flex gap-2.5">
        <div className="flex gap-1.5">
          <Image src={Callender} alt="Callender" width={16} height={16} />
          <div className="text-xs-regular h-4 text-left text-text-default">
            {formatDate(task.updatedAt)}
          </div>
        </div>
        <Image src={VectorIcon} alt="VectorIcon" width={0} height={8} />
        <div className="flex gap-1.5">
          <Image src={Repeat} alt="Repeat" width={16} height={16} />
          <div className="text-xs-regular h-4 text-left text-text-default">
            {task.frequency}
          </div>
        </div>
      </div>
    </div>
  );
}
