'use client';

import Image from 'next/image';
import MockupImage1 from '@/assets/landing/mockup_1.svg';
import MockupImage2 from '@/assets/landing/mockup_2.svg';
import MockupImage3 from '@/assets/landing/mockup_3.svg';
import LandingIcon1 from '@/assets/landing/ic_landing_1.svg';
import LandingIcon2 from '@/assets/landing/ic_landing_2.svg';
import LandingIcon3 from '@/assets/landing/ic_landing_3.svg';
import LandingImage1 from '@/assets/landing/landing_1.png';
import LandingImage2 from '@/assets/landing/landing_2.png';
import RepairIcon from '@/assets/icons/ic_repair.svg';
import { authAxiosInstance } from '../api/auth/axiosInstance';
import { useRouter } from 'next/navigation';
import useSessionStore from '@/store/useSessionStore';
import { useEffect } from 'react';

export default function Landing() {
  const session = useSessionStore();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (session && session.accessToken) {
        const token = session.accessToken;

        try {
          const userResponse = await authAxiosInstance.get('/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (userResponse.data.memberships.length > 0) {
            router.push(
              `/teampage/${userResponse.data.memberships[0].groupId}`,
            );
          } else {
            router.push(`/no-team`);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [session, router]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[640px] w-full overflow-hidden md:h-[940px] lg:h-[1080px]">
        <div className="absolute inset-0 h-full w-full">
          <Image
            src={LandingImage1}
            alt="랜딩 페이지 이미지"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>
        <div className="absolute inset-x-0 top-[115px] -translate-y-1/2 transform text-center md:top-[160px] lg:top-[144px]">
          <div className="mb-1 flex items-center justify-center md:mb-2 lg:mb-5">
            <h1 className="text-2xl-medium lg:text-6xl-semibold md:text-4xl-semibold">
              함께 만들어가는 투두 리스트
            </h1>
            <div className="ml-4 md:ml-4 lg:ml-6">
              <Image
                src={RepairIcon}
                alt="Repair 아이콘"
                width={28}
                height={28}
                className="md:h-[48px] md:w-[48px] lg:h-[56px] lg:w-[56px]"
              />
            </div>
          </div>
          <span
            className="text-3xl-semibold md:text-6xl-semibold lg:text-[64px] lg:font-semibold lg:leading-[76px]"
            style={{
              background: 'linear-gradient(90deg, #10B981 0%, #CEF57E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Coworkers
          </span>
        </div>
        <a
          href="/login"
          className="text-lg-semibold absolute bottom-12 left-1/2 h-[45px] w-[343px] -translate-x-1/2 transform rounded-full bg-gradient-to-r from-[#10B981] to-[#A3E635] px-[143px] py-[13px] md:bottom-[120px] md:h-[48px] md:w-[373px]"
          style={{
            whiteSpace: 'nowrap',
            minWidth: 'fit-content',
          }}
        >
          지금 시작하기
        </a>
      </div>

      <div className="relative mb-6 h-[467px] w-[343px] rounded-[40px] bg-gradient-to-r from-[#10B981] to-[#CEF57E] p-[1px] md:h-[354px] md:w-[696px] lg:mb-20 lg:mt-[60px] lg:h-[419px] lg:w-[996px]">
        <div
          className="relative h-full w-full rounded-[40px] bg-[rgba(15,23,42,1)] p-6 md:bg-[rgba(15,23,42,1)]"
          style={{
            boxShadow: '0px 0px 12px 2px #FFFFFF40',
          }}
        >
          <div className="absolute left-[54px] top-[194px] md:left-[121px] md:top-[81px] lg:left-[174px] lg:top-[81px]">
            <Image
              src={MockupImage1}
              alt="앱 Mockup 이미지"
              width={235}
              height={273}
              className="object-cover lg:h-[338px] lg:w-[291px]"
            />
          </div>
          <div className="absolute left-[54px] top-[48px] flex flex-col items-start md:left-[456px] md:top-[124px] lg:left-[658px] lg:top-[155px]">
            <Image
              src={LandingIcon1}
              alt="아이콘 이미지"
              width={48}
              height={48}
              className="mb-3 lg:mb-4"
            />
            <p className="text-2lg-medium lg:text-2xl-medium bg-transparent text-left">
              그룹으로
              <br />할 일을 관리해요
            </p>
          </div>
        </div>
      </div>

      <div
        className="relative mb-6 h-[467px] w-[343px] rounded-[40px] border p-6 md:h-[354px] md:w-[696px] lg:mb-20 lg:h-[419px] lg:w-[996px]"
        style={{
          background: 'var(--Background-Secondary, #1E293B)',
          border: '1px solid var(--Border-Primary, #F8FAFC1A)',
        }}
      >
        <div className="absolute bottom-[194px] right-[54px] md:bottom-[81px] md:right-[121px] lg:bottom-[81px] lg:right-[174px]">
          <Image
            src={MockupImage2}
            alt="앱 Mockup 이미지"
            width={235}
            height={273}
            className="object-cover lg:h-[338px] lg:w-[291px]"
          />
        </div>
        <div className="absolute left-[54px] top-[313px] flex flex-col items-start md:left-[121px] md:top-[126px] lg:left-[181px] lg:top-[155px]">
          <Image
            src={LandingIcon2}
            alt="아이콘 이미지"
            width={48}
            height={48}
            className="mb-4"
          />
          <p className="text-2lg-medium lg:text-2xl-medium bg-transparent text-left">
            간단하게 멤버들을
            <br />
            초대해요
          </p>
        </div>
      </div>

      <div className="relative mb-6 h-[467px] w-[343px] rounded-[40px] border-none bg-slate-950 p-6 md:h-[354px] md:w-[696px] lg:mb-20 lg:h-[419px] lg:w-[996px]">
        <div className="absolute bottom-[193px] left-[54px] md:bottom-[81px] md:left-[121px] lg:bottom-[81px] lg:left-[174px]">
          <Image
            src={MockupImage3}
            alt="앱 Mockup 이미지"
            width={235}
            height={273}
            className="object-cover lg:h-[338px] lg:w-[291px]"
          />
        </div>
        <div className="absolute left-[54px] top-[314px] flex flex-col items-start md:left-[446px] md:top-[112px] lg:left-[658px] lg:top-[155px]">
          <Image
            src={LandingIcon3}
            alt="아이콘 이미지"
            width={48}
            height={48}
            className="mb-4"
          />
          <p className="text-2lg-medium lg:text-2xl-medium bg-transparent text-left">
            할 일도 간편하게
            <br />
            체크해요
          </p>
        </div>
      </div>

      <div className="relative flex w-full flex-col items-center">
        <div className="mt-[123px] text-center md:mt-[176px] lg:mt-[230px]">
          <h1 className="text-2xl-semibold md:text-4xl-semibold lg:text-4xl-semibold lg: mb-4 md:mb-6">
            지금 바로 시작해보세요
          </h1>
          <p className="text-lg-medium md:text-2xl-medium lg:text-2xl-medium">
            팀원 모두와 같은 방향,
            <span className="hidden md:inline lg:inline">
              {' '}
              같은 속도로 나아가는 가장 쉬운 방법
            </span>
            <span className="md:hidden lg:hidden">
              <br /> 같은 속도로 나아가는 가장 쉬운 방법
            </span>
          </p>
        </div>
        <div className="relative h-[400px] w-full overflow-hidden">
          <Image
            src={LandingImage2}
            alt="랜딩 페이지 이미지2"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>
      </div>
    </div>
  );
}
