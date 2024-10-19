import MemberIcon from '@/assets/icons/ic_member.svg';
import Image from 'next/image';
import TimeAgo from './TimeAgo';

interface CardProp {
  updateAt?: Date;
  name?: string;
  profileImage?: string;
}

export default function CardProfile({
  updateAt,
  name,
  profileImage,
}: CardProp) {
  return (
    <div className="mb-4 flex h-8 w-[343px] justify-between md:w-full lg:w-full">
      <div className="gap-3">
        <Image
          src={profileImage || MemberIcon}
          alt="프로필"
          width={24}
          height={24}
        />
        <p className="text-md-medium text-text-primary">{name}</p>
      </div>
      <p className="text-md-regular text-text-secondary">
        {updateAt && <TimeAgo date={updateAt} />}
      </p>
    </div>
  );
}
