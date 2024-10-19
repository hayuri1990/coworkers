import Image from 'next/image';
import Kebab from '@/assets/icons/ic_kebab.svg';
import MemberIcon from '@/assets/icons/ic_member.svg';
import { useState } from 'react';
import CardProfile from './CardProfile';

interface AnswerCardProps {
  updateAt?: Date;
  name?: string;
  profileImage?: string;
  content?: string;
}

export default function AnswerCard({
  updateAt,
  name,
  profileImage,
  content,
}: AnswerCardProps) {
  return (
    <div className="border-b-1 h-[98px] w-[343px] gap-4 border border-border-primary md:w-[387px] lg:w-[699px]">
      <div className="mb-4 flex w-[343px] justify-between">
        <p className="text-md-regular text-text-primary">{content}</p>
        <button>
          <Image src={Kebab} alt="케밥" width={16} height={16} />
        </button>
      </div>
      <CardProfile
        updateAt={updateAt}
        profileImage={profileImage}
        name={name}
      />
    </div>
  );
}
