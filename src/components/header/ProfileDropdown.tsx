'use client';

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import IcProfile from '@/assets/icons/ic_profile.svg';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { IUser } from '@/types/user';
import { useModalStore } from '@/store/useModalStore';
import ModalWrapper from '../modal/ModalWrapper';
import LogoutModal from '@/components/modal/ModalDangerLogout';

interface ProfileDropdownProps {
  user: IUser;
  isLoading: boolean;
}

export default function ProfileDropdown({
  user,
  isLoading,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => setIsOpen(!isOpen);

  // 모달
  const { isModalOpen, openModal, closeModal } = useModalStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL });
  };

  if (isLoading) {
    return <p>...loading</p>;
  }

  if (!user) {
    return <div></div>; // user가 null일 경우 예외 처리
  }

  return (
    <div className="relative z-30" ref={dropdownRef}>
      <button onClick={toggleDropdown}>
        <div className="flex flex-row items-center justify-center gap-[8px]">
          {user?.image ? (
            <Image
              width={28}
              height={28}
              src={user?.image}
              alt="이미지"
              className="h-[28px] w-[28px] rounded-full object-cover"
            />
          ) : (
            <Image
              className="w-6 md:w-4 lg:w-4"
              src={IcProfile}
              alt="사용자 프로필"
            />
          )}
          <span className="text-md-medium hidden lg:block">
            {user.nickname}
          </span>
        </div>
      </button>
      {isOpen && (
        <ul className="text-lg-regular absolute right-0 top-10 z-30 mt-2 flex h-[184px] w-[135px] flex-col justify-center gap-[8px] rounded-[12px] border border-background-tertiary bg-background-secondary p-[14px] text-sm shadow-lg">
          <Link className="mg-0" href="/my-history">
            <li className="rounded-[8px] bg-background-secondary p-2 text-center hover:bg-slate-700">
              마이 히스토리
            </li>
          </Link>
          <Link className="mg-0" href="/mypage">
            <li className="items-center justify-between rounded-[8px] bg-background-secondary p-2 text-center hover:bg-slate-700">
              계정 설정
            </li>
          </Link>
          <Link href="/join-team">
            <li className="items-center justify-between rounded-[8px] bg-background-secondary p-2 text-center hover:bg-slate-700">
              팀 참여
            </li>
          </Link>
          <li className="items-center justify-between rounded-[8px] bg-background-secondary p-2 text-center hover:bg-slate-700">
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openModal();
              }}
            >
              로그아웃
            </Link>
          </li>
        </ul>
      )}

      {/* 로그아웃 모달 */}
      {isModalOpen && (
        <ModalWrapper>
          <LogoutModal
            isOpen={true}
            onClose={closeModal}
            handleSignOut={handleSignOut}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
