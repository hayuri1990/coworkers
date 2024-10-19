import { useState } from 'react';
import CardProfile from './CardProfile';

interface MyAnswerCardProps {
  updateAt: Date;
  name: string;
  profileImage?: string;
  content: string;
}

export default function MyAnswerCard({
  updateAt,
  name,
  profileImage,
  content,
}: MyAnswerCardProps) {
  return (
    <div className="w-[343px] md:w-[387px] lg:w-[699px]">
      <CardProfile
        updateAt={updateAt}
        profileImage={profileImage}
        name={name}
      />
      <p className="text-md-regular mt-4 w-full text-text-primary">{content}</p>
    </div>
  );
}
