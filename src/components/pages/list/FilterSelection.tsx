import { useState } from 'react';
interface FilterProps {
  filters: string[]; // 필터 배열은 task.name 값들
  onSelect: (filter: string) => void; // 선택된 필터를 상위 컴포넌트로 전달하는 콜백
}

export default function FilterSelection({ filters, onSelect }: FilterProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('');

  const handleSelect = (filter: string) => {
    setSelectedFilter(filter);
    onSelect(filter); // 선택된 필터를 상위 컴포넌트로 전달
  };

  return (
    <div className="mb-4 flex h-[25px] items-center">
      <div className="flex space-x-3">
        {filters.map((filter: string) => (
          <button
            key={filter}
            onClick={() => handleSelect(filter)}
            className={`duration-200 ${
              selectedFilter === filter
                ? 'text-white-500 border-b-2 text-lg font-bold underline'
                : 'border-b-0 text-base text-gray-700'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
