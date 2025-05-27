// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { apiGetWithToken, apiPostWithToken } from '../utils/Api'; // apiGetWithToken 함수 경로

interface UserAuthMe {
  member: {
    id: number;
    name: string;
    profileImageUrl: string;
    grade: string;
  },
  registrationComplete: boolean;
}


export function useAuth() {
  const [user, setUser] = useState<UserAuthMe | null>(null);        // 로그인한 사용자 정보
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const [isLoading, setIsLoading] = useState(true);   // 로딩 상태 (초기에는 true로 설정)
  const [error, setError] = useState(null);         // 에러 상태

  const checkLoginStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiGetWithToken('/api/v1/auth/me');
      if (response && response.data) { // response.data.data 대신 response.data 로 수정 (API 응답 구조에 따라 다름)
        setUser(response.data.data);
        setIsLoggedIn(true);
      } else {
        // API는 성공했으나, 데이터가 없는 경우        
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error('Error checking login status in useAuth:', err);
      setUser(null);
      setIsLoggedIn(false);
      setError(err.message || 'Failed to check login status');
      // 401, 403 등의 에러 발생 시 토큰 삭제 로직을 여기에 추가할 수도 있습니다.
      // 예: if (err.message.includes('401') || err.message.includes('403')) localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]); // checkLoginStatus가 변경될 때마다 (실제로는 마운트 시 한 번) 실행

  // 로그인 성공 시 수동으로 상태 업데이트 (로그인 함수에서 호출)
  const manualLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setError(null);
  };

  // 로그아웃 시 수동으로 상태 업데이트 (로그아웃 함수에서 호출)
  const manualLogout = async () => {
    setUser(null);
    setIsLoggedIn(false);
    setError(null);
    await apiPostWithToken('/api/v1/auth/logout');
  };


  return {
    user,
    isLoggedIn,
    isLoading,
    error,
    checkLoginStatus, // 외부에서 재확인하고 싶을 때 사용
    manualLogin,      // 로그인 폼 등에서 로그인 성공 시 호출
    manualLogout,     // 로그아웃 버튼 등에서 호출
  };
}

