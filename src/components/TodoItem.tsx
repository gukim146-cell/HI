import React from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Todo } from '../types';
import { retroAudio } from '../utils/sound';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * TodoItem 컴포넌트 (8-Bit Pixel Art 버전)
 * - 8비트 RPG 퀘스트 슬롯 스타일로 렌더링됩니다.
 * - 픽셀 체크박스 클릭 시 코인 획득 사운드와 함께 완료 상태로 전환됩니다.
 * - 완료 시 취소선 및 [CLEAR] 뱃지가 표시됩니다.
 * - 픽셀 삭제 버튼 제공 (피격 사운드)
 */
export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const handleToggle = () => {
    if (!todo.completed) {
      retroAudio.playCoin();
    } else {
      retroAudio.playSelect();
    }
    onToggle(todo.id);
  };

  const handleDelete = () => {
    retroAudio.playHit();
    onDelete(todo.id);
  };

  return (
    <li
      className={`pixel-btn group flex items-center justify-between gap-3 p-3 transition-all ${
        todo.completed
          ? 'bg-[#151624] text-[#6b6c86] border-[#222438] opacity-85'
          : 'bg-[#1e2034] text-white border-black hover:bg-[#262842]'
      }`}
    >
      {/* 픽셀 체크박스 및 퀘스트 내용 */}
      <div
        onClick={handleToggle}
        className="flex flex-1 cursor-pointer items-center gap-3 select-none"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        {/* 레트로 8-Bit 픽셀 체크박스 */}
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center border-2 border-black transition-all ${
            todo.completed
              ? 'bg-[#00ff66] text-black shadow-[inset_1px_1px_0px_#000]'
              : 'bg-[#0e0f1a] text-transparent shadow-[inset_2px_2px_0px_#000] group-hover:border-[#00e5ff]'
          }`}
        >
          {todo.completed && <Check className="h-4 w-4 stroke-[4]" />}
        </div>

        {/* 퀘스트 텍스트 및 메타 정보 */}
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2">
            {todo.completed && (
              <span className="bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66] px-1 py-0.2 text-[9px] font-black">
                CLEAR
              </span>
            )}
            <span
              className={`text-sm break-all font-bold tracking-wide ${
                todo.completed
                  ? 'line-through text-[#6a6c88]'
                  : 'text-[#eef0ff]'
              }`}
            >
              {todo.text}
            </span>
          </div>
          <span className="text-[10px] text-[#787a99] font-mono mt-0.5">
            LOG: {todo.createdAt}
          </span>
        </div>
      </div>

      {/* 8-Bit 픽셀 삭제 버튼 */}
      <button
        type="button"
        onClick={handleDelete}
        className="pixel-btn flex h-8 w-8 items-center justify-center bg-[#ff0055] text-white hover:bg-[#ff266f] active:scale-95"
        title="퀘스트 삭제"
        aria-label={`${todo.text} 삭제`}
      >
        <Trash2 className="h-4 w-4 stroke-[2.5]" />
      </button>
    </li>
  );
};
