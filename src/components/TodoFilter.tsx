import React from 'react';
import { FilterType } from '../types';
import { retroAudio } from '../utils/sound';

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

/**
 * TodoFilter 컴포넌트 (8-Bit Pixel Art 버전)
 * - 아케이드 셀렉트 모드 스타일의 픽셀 버튼 탭
 * - '전체' / '진행 중' / '완료' 필터링을 지원합니다.
 */
export const TodoFilter: React.FC<TodoFilterProps> = ({
  currentFilter,
  onFilterChange,
  counts,
}) => {
  const filterOptions: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: '전체 (ALL)', count: counts.all },
    { key: 'active', label: '진행 중 (ACTIVE)', count: counts.active },
    { key: 'completed', label: '완료 (CLEARED)', count: counts.completed },
  ];

  const handleSelect = (key: FilterType) => {
    retroAudio.playSelect();
    onFilterChange(key);
  };

  return (
    <div className="mb-4 border-b-2 border-black pb-3">
      <div className="grid grid-cols-3 gap-2">
        {filterOptions.map((option) => {
          const isActive = currentFilter === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => handleSelect(option.key)}
              className={`pixel-btn flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-2 text-center text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#00e5ff] text-black shadow-[3px_3px_0px_#000]'
                  : 'bg-[#212338] text-[#9d9db5] hover:bg-[#2c2e4a] hover:text-white shadow-[2px_2px_0px_#000]'
              }`}
            >
              <span>{option.label}</span>
              <span
                className={`px-1.5 py-0.5 text-[10px] font-black ${
                  isActive ? 'bg-black text-[#00e5ff]' : 'bg-black/40 text-[#ffea00]'
                }`}
              >
                {option.count < 10 ? `0${option.count}` : option.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
