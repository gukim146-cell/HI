/**
 * Firebase 초기화 및 Firestore 인스턴스 설정 파일
 * - firebase-applet-config.json의 프로젝트 구성 정보를 사용하여 Firebase App을 초기화합니다.
 * - Firestore Database 인스턴스를 생성하여 내보냅니다.
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Firebase 앱 인스턴스 초기화
export const app = initializeApp(firebaseConfig);

// 지정된 Database ID를 반영하여 Firestore 인스턴스 생성
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);
