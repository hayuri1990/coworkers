import { formatDistanceToNow, format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function TimeAgo({ date }: { date: Date }) {
  const now = new Date();
  const differenceInDays =
    (now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24);

  // 7일(1주)보다 오래되면 원래 날짜 표시, 그렇지 않으면 상대적 시간 표시
  if (differenceInDays > 7) {
    return <span>{format(new Date(date), 'yyyy년 MM월 dd일')}</span>;
  }

  return (
    <span>
      {formatDistanceToNow(new Date(date), { addSuffix: true, locale: ko })}
    </span>
  );
}
