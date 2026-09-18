import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { retroAudio } from '../utils/sound';

interface TodoInputProps {
  onAddTodo: (text: string) => void;
}

/**
 * TodoInput 컴포넌트 (8-Bit Pixel Art 버전)
 * - 아케이드 커맨드 입력창 스타일의 폼 컴포넌트입니다.
 * - 오직 React의 useState 훅만으로 입력 상태를 관리합니다.
 */
export const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  // 입력 필드의 로컬 상태
  const [text, setText] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    // 사운드 재생 (파워업 효과음)
    retroAudio.playPowerUp();

    onAddTodo(trimmed);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-5">
      <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
        {/* 아케이드 픽셀 텍스트 인풋 필드 */}
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="[새 퀘스트 입력] 예: 몬스터 퇴치하기"
            className="w-full border-3 border-black bg-[#161726] px-3.5 py-3 text-sm text-[#00ffcc] placeholder-[#5d5e77] shadow-[inset_2px_2px_0px_#000000] focus:bg-[#1c1d30] focus:outline-none focus:ring-2 focus:ring-[#00e5ff]"
          />
        </div>

        {/* 픽셀 액션 버튼 */}
        <button
          type="submit"
          disabled={!text.trim()}
          className="pixel-btn flex items-center justify-center gap-1.5 bg-[#ffea00] px-5 py-3 text-sm font-black text-black hover:bg-[#fff24d] disabled:cursor-not-allowed disabled:bg-[#343650] disabled:text-[#6a6c8a] disabled:shadow-none"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>퀘스트 추가</span>
        </button>
      </div>
    </form>
  );
};
