/**
 * 할 일(Todo) 데이터 모델 인터페이스입니다.
 */
export interface Todo {
  id: string;                  // Firestore 문서 고유 식별자 (Document ID)
  text: string;                // 할 일 내용 (퀘스트 설명)
  completed: boolean;          // 완료 여부 (true: 완료, false: 진행 중)
  createdAt: string;           // 생성 일시 (표시용 문자열)
  createdAtTimestamp?: number; // 정렬용 타임스탬프 (밀리초)
}

/**
 * 목록 필터링 타입
 * - 'all': 전체 보기
 * - 'active': 진행 중인 할 일만 보기
 * - 'completed': 완료된 할 일만 보기
 */
export type FilterType = 'all' | 'active' | 'completed';
