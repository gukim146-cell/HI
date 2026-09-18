import React from 'react';
import { Ghost, Sword } from 'lucide-react';
import { FilterType, Todo } from '../types';
import { TodoItem } from './TodoItem';
import { retroAudio } from '../utils/sound';

interface TodoListProps {
  todos: Todo[];
  currentFilter: FilterType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClearCompleted?: () => void;
  hasCompleted: boolean;
}

/**
 * TodoList 컴포넌트 (8-Bit Pixel Art 버전)
 * - 아케이드 퀘스트 목록을 렌더링합니다.
 * - 등록된 퀘스트가 없을 시 레트로 게임 스타일의 알림 메시지를 표시합니다.
 */
export const TodoList: React.FC<TodoListProps> = ({
  todos,
  currentFilter,
  onToggle,
  onDelete,
  onClearCompleted,
  hasCompleted,
}) => {
  const getEmptyMessage = () => {
    switch (currentFilter) {
      case 'active':
        return '진행 중인 퀘스트가 없습니다! 모든 미션 클리어!';
      case 'completed':
        return '아직 완료된 퀘스트가 없습니다.';
      default:
        return '등록된 퀘스트가 없습니다. 새 퀘스트를 수락하세요!';
    }
  };

  const handleClearCompleted = () => {
    retroAudio.playHit();
    if (onClearCompleted) onClearCompleted();
  };

  return (
    <div className="space-y-3">
      {todos.length === 0 ? (
        // 아케이드 레트로 빈 상태(Empty State) UI
        <div className="pixel-box flex flex-col items-center justify-center border-dashed border-[#3b3d5c] bg-[#121320] py-10 px-4 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center border-2 border-black bg-[#252740] text-[#ffea00] shadow-[2px_2px_0px_#000]">
            {currentFilter === 'completed' ? (
              <Sword className="h-6 w-6" />
            ) : (
              <Ghost className="h-6 w-6 text-[#00e5ff]" />
            )}
          </div>
          <p className="text-sm font-bold text-[#ffea00]">{getEmptyMessage()}</p>
          <p className="mt-1 text-xs text-[#7e80a0]">
            {currentFilter === 'all'
              ? '위 입력창에 첫 번째 미션을 입력하세요.'
              : '다른 필터 탭을 눌러 확인해 보세요.'}
            <span className="pixel-blink ml-1 text-[#00ff66]">_</span>
          </p>
        </div>
      ) : (
        // 퀘스트 슬롯 목록
        <ul className="space-y-2">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}

      {/* 완료된 항목 전체 정리 픽셀 버튼 */}
      {hasCompleted && onClearCompleted && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleClearCompleted}
            className="pixel-btn bg-[#2a2b3f] px-3 py-1.5 text-xs font-bold text-[#e1e2f5] hover:bg-[#ff0055] hover:text-white"
          >
            [완료된 퀘스트 일괄 정리]
          </button>
        </div>
      )}
    </div>
  );
};
