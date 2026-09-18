import React, { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { FilterType, Todo } from './types';
import { TodoHeader } from './components/TodoHeader';
import { TodoInput } from './components/TodoInput';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { retroAudio } from './utils/sound';

/**
 * 초기 퀘스트 시드 데이터
 * - Firestore 'todos' 컬렉션이 비어있는 최초 실행 시 자동 등록됩니다.
 */
const INITIAL_SEED_TODOS = [
  {
    text: '마을 촌장에게 퀘스트 보고하기',
    completed: true,
    createdAt: '09:00 AM',
    createdAtTimestamp: Date.now() - 3000,
  },
  {
    text: '슬라임 던전에서 아이템 3개 수집하기',
    completed: false,
    createdAt: '10:30 AM',
    createdAtTimestamp: Date.now() - 2000,
  },
  {
    text: '전설의 무기 강화 및 보스전 준비하기',
    completed: false,
    createdAt: '11:45 AM',
    createdAtTimestamp: Date.now() - 1000,
  },
];

/**
 * Pixel Art / Retro Game Todo List 메인 컴포넌트
 * - Firebase Firestore 실시간 연동 (onSnapshot, addDoc, updateDoc, deleteDoc)
 * - 새로고침을 하거나 다른 브라우저 창에서 접속해도 데이터가 실시간으로 보존 및 동기화됩니다.
 */
export default function App() {
  // 1. Firestore에서 실시간으로 불러온 할 일 목록 상태
  const [todos, setTodos] = useState<Todo[]>([]);

  // 2. 데이터 초기 로딩 상태
  const [loading, setLoading] = useState<boolean>(true);

  // 3. 현재 선택된 필터 상태 ('all' | 'active' | 'completed')
  const [filter, setFilter] = useState<FilterType>('all');

  // 4. 8비트 사운드 이펙트 켜기/끄기 상태
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // 사운드 토글 핸들러
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    retroAudio.enabled = nextState;
  };

  /**
   * [Firestore 연동 1] 실시간 데이터 구독 (Real-time Listener)
   * - 컴포넌트 마운트 시 Firestore의 'todos' 컬렉션을 구독합니다.
   * - 생성일시(createdAtTimestamp) 내림차순(최신순)으로 정렬하여 불러옵니다.
   * - 최초 실행으로 데이터가 없을 경우 기본 퀘스트를 시딩합니다.
   */
  useEffect(() => {
    const todosCollection = collection(db, 'todos');
    const todosQuery = query(todosCollection, orderBy('createdAtTimestamp', 'desc'));

    // onSnapshot을 통해 Firestore의 데이터 변경 사항을 실시간 반영
    const unsubscribe = onSnapshot(
      todosQuery,
      async (snapshot) => {
        // 최초 실행 시 컬렉션이 비어있다면 기본 예시 데이터 등록
        if (snapshot.empty && loading) {
          try {
            const batch = writeBatch(db);
            INITIAL_SEED_TODOS.forEach((item) => {
              const newDocRef = doc(todosCollection);
              batch.set(newDocRef, item);
            });
            await batch.commit();
          } catch (seedErr) {
            console.error('기본 퀘스트 데이터 시딩 중 오류:', seedErr);
          }
          setLoading(false);
          return;
        }

        // Firestore 문서 데이터를 Todo 인터페이스에 맞게 매핑
        const loadedTodos: Todo[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            text: data.text || '',
            completed: Boolean(data.completed),
            createdAt: data.createdAt || '',
            createdAtTimestamp: data.createdAtTimestamp || 0,
          };
        });

        setTodos(loadedTodos);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore 데이터 수신 중 오류 발생:', error);
        setLoading(false);
      }
    );

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, [loading]);

  /**
   * [Firestore 연동 2] 할 일(퀘스트) 추가 함수
   * - addDoc을 통해 Firestore 'todos' 컬렉션에 새 문서를 생성합니다.
   */
  const handleAddTodo = async (text: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const timestamp = Date.now();

    try {
      await addDoc(collection(db, 'todos'), {
        text,
        completed: false,
        createdAt: timeString,
        createdAtTimestamp: timestamp,
      });
    } catch (error) {
      console.error('Firestore 퀘스트 추가 실패:', error);
    }
  };

  /**
   * [Firestore 연동 3] 할 일 완료 토글 함수
   * - updateDoc을 통해 Firestore 해당 문서의 completed 속성을 수정합니다.
   */
  const handleToggleTodo = async (id: string) => {
    const targetTodo = todos.find((todo) => todo.id === id);
    if (!targetTodo) return;

    try {
      const todoDocRef = doc(db, 'todos', id);
      await updateDoc(todoDocRef, {
        completed: !targetTodo.completed,
      });
    } catch (error) {
      console.error('Firestore 완료 상태 업데이트 실패:', error);
    }
  };

  /**
   * [Firestore 연동 4] 할 일 삭제 함수
   * - deleteDoc을 통해 Firestore에서 해당 문서를 삭제합니다.
   */
  const handleDeleteTodo = async (id: string) => {
    try {
      const todoDocRef = doc(db, 'todos', id);
      await deleteDoc(todoDocRef);
    } catch (error) {
      console.error('Firestore 퀘스트 삭제 실패:', error);
    }
  };

  /**
   * [Firestore 연동 5] 완료된 항목 전체 삭제 함수
   * - writeBatch를 사용하여 완료된 문서들을 일괄 삭제(Batch Delete)합니다.
   */
  const handleClearCompleted = async () => {
    const completedTodos = todos.filter((todo) => todo.completed);
    if (completedTodos.length === 0) return;

    try {
      const batch = writeBatch(db);
      completedTodos.forEach((todo) => {
        const todoDocRef = doc(db, 'todos', todo.id);
        batch.delete(todoDocRef);
      });
      await batch.commit();
    } catch (error) {
      console.error('Firestore 완료 항목 일괄 삭제 실패:', error);
    }
  };

  // [기능 6] 현재 선택된 필터에 따른 목록 필터링
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = totalCount - completedCount;

  return (
    <div className="min-h-screen bg-[#0d0e19] px-3 py-6 sm:py-10 text-[#e4e6f5]">
      <main className="mx-auto w-full max-w-xl">
        {/* 아케이드 캐비닛 상단 네온 마퀴 바 */}
        <div className="mb-2 flex items-center justify-between border-b-4 border-black bg-[#ff0055] px-4 py-2 font-black text-white shadow-[4px_4px_0px_#000]">
          <span className="tracking-widest text-xs sm:text-sm">★ ARCADE QUEST SYSTEM ★</span>
          <span className="text-[11px] bg-black px-2 py-0.5 text-[#ffea00] border border-black flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00ff66] animate-ping" />
            ONLINE CLOUD
          </span>
        </div>

        {/* 메인 아케이드 CRT 콘솔 스크린 박스 */}
        <div className="retro-crt-screen pixel-box overflow-hidden bg-[#161729] p-4 sm:p-6 text-white">
          {/* 헤더 영역: 퀘스트 로그 제목 & EXP 바 & 사운드 토글 */}
          <TodoHeader
            totalCount={totalCount}
            completedCount={completedCount}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />

          {/* 입력 영역: 새 퀘스트 추가 인풋 및 픽셀 버튼 */}
          <TodoInput onAddTodo={handleAddTodo} />

          {/* 필터 영역: 전체 / 진행 중 / 완료 픽셀 버튼 탭 */}
          <TodoFilter
            currentFilter={filter}
            onFilterChange={setFilter}
            counts={{
              all: totalCount,
              active: activeCount,
              completed: completedCount,
            }}
          />

          {/* 데이터 로딩 인디케이터 or 퀘스트 슬롯 리스트 */}
          {loading ? (
            <div className="pixel-box flex items-center justify-center border-dashed border-[#3b3d5c] bg-[#121320] py-12 text-center">
              <p className="text-xs font-bold text-[#00e5ff] tracking-widest">
                CONNECTING TO FIRESTORE DATABASE...
                <span className="pixel-blink ml-1 text-[#ffea00]">■</span>
              </p>
            </div>
          ) : (
            <TodoList
              todos={filteredTodos}
              currentFilter={filter}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
              onClearCompleted={handleClearCompleted}
              hasCompleted={completedCount > 0}
            />
          )}
        </div>

        {/* 아케이드 캐비닛 컨트롤러 하단 데코레이션 */}
        <div className="mt-3 flex items-center justify-between border-2 border-black bg-[#1f2136] px-3 py-2 text-[11px] text-[#9395b0] shadow-[3px_3px_0px_#000]">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-none bg-[#ff0055] border border-black inline-block" />
            <span className="h-2.5 w-2.5 rounded-none bg-[#ffea00] border border-black inline-block" />
            <span className="h-2.5 w-2.5 rounded-none bg-[#00ff66] border border-black inline-block" />
            <span className="h-2.5 w-2.5 rounded-none bg-[#00e5ff] border border-black inline-block" />
          </div>
          <span className="text-[10px] tracking-wider text-[#a0a3c2]">
            POWERED BY FIREBASE FIRESTORE • REALTIME CLOUD SYNC
          </span>
        </div>
      </main>
    </div>
  );
}
