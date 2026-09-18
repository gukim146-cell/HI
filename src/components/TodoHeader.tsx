import React from 'react';
import { Gamepad2, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { retroAudio } from '../utils/sound';

interface TodoHeaderProps {
  totalCount: number;
  completedCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

/**
 * TodoHeader 컴포넌트 (8-Bit Arcade 버전)
 * - 아케이드 콘솔 상단 마퀴 및 EXP(경험치) 진행률 바를 표시합니다.
 * - 레트로 8비트 사운드 온/오프 픽셀 버튼을 포함합니다.
 */
export const TodoHeader: React.FC<TodoHeaderProps> = ({
  totalCount,
  completedCount,
  soundEnabled,
  onToggleSound,
}) => {
  // 퀘스트 완료율(EXP) 계산
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="mb-6">
      {/* 아케이드 상단 스테이터스 바 */}
      <div className="mb-3 flex items-center justify-between border-b-2 border-black pb-2 text-[11px] text-[#ffcc00] tracking-wider">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 bg-[#00ff66] animate-pulse" />
          <span>PLAYER 1: READY</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#00e5ff]">STAGE 01</span>
          {/* 사운드 토글 픽셀 버튼 */}
          <button
            type="button"
            onClick={() => {
              onToggleSound();
              if (!soundEnabled) {
                retroAudio.playSelect();
              }
            }}
            className="pixel-btn flex items-center gap-1 bg-[#232438] px-2 py-0.5 text-[10px] text-white hover:bg-[#343654]"
            title={soundEnabled ? '사운드 끄기' : '사운드 켜기'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="h-3 w-3 text-[#00ff66]" />
                <span>SFX ON</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3 w-3 text-[#ff0055]" />
                <span>SFX OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 아케이드 타이틀 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="pixel-box flex h-12 w-12 items-center justify-center bg-[#ff0055] text-white">
            <Gamepad2 className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white drop-shadow-[2px_2px_0px_#000]">
              QUEST LOG
            </h1>
            <p className="text-xs text-[#9d9db5] flex items-center gap-1">
              <span>오늘의 퀘스트를 클리어하세요!</span>
              <Sparkles className="h-3 w-3 text-[#ffea00]" />
            </p>
          </div>
        </div>

        {/* 클리어 뱃지 */}
        <div className="pixel-box bg-[#00e5ff] px-3 py-1.5 text-xs font-bold text-black">
          CLEAR: {completedCount} / {totalCount}
        </div>
      </div>

      {/* 8-Bit EXP 진행률 게이지 바 */}
      <div className="mt-4 border-2 border-black bg-[#151624] p-1.5 shadow-[2px_2px_0px_0px_#000]">
        <div className="mb-1 flex justify-between text-[10px] font-bold text-[#a0a0ba]">
          <span>EXP GAUGE</span>
          <span className="text-[#00ff66]">{percentage}% COMPLETED</span>
        </div>
        <div className="h-4 w-full border-2 border-black bg-[#0a0a12] p-0.5">
          <div
            className="h-full bg-linear-to-r from-[#ff0055] via-[#ffcc00] to-[#00ff66] transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </header>
  );
};
