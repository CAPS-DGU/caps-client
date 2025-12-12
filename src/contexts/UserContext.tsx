import React, { createContext, useState, useContext, useEffect, useMemo, ReactNode } from 'react';
import { apiGetWithToken } from '../utils/Api';

// 1. 사용자 정보 타입 정의
interface User {
  id: number;
  role: string;
  name: string;
  studentNumber: string;
  grade: number;
  email: string;
  phoneNumber: string;
  comment: string;
  profileImageUrl: string;
  registrationComplete: boolean;
  isDeleted: boolean;
}

// 2. 컨텍스트가 제공할 값들의 타입 정의
interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// 3. 컨텍스트 생성 (초기값은 undefined 또는 기본값)
//    커스텀 훅에서 undefined 체크를 할 것이므로 undefined로 시작하는 것이 일반적입니다.
const UserContext = createContext<UserContextType | undefined>(undefined);

// 4. UserProvider 컴포넌트 정의
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 앱 시작 시 인증 상태 확인 중일 수 있음

  // 실제 앱에서는 이 useEffect에서 로컬 스토리지나 쿠키를 확인하여
  // 초기 로그인 상태를 설정할 수 있습니다.
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await apiGetWithToken('/api/v1/members/me');
        if (response && response.data) {
          setUser(response.data.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error checking login status in useAuth:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserData();
  }, []);

  const isAuthenticated = !!user;

  // useMemo를 사용하여 contextValue 객체가 불필요하게 재생성되는 것을 방지합니다.
  // 이는 Provider 하위의 Consumer 컴포넌트들의 불필요한 리렌더링을 막아줍니다.
  const contextValue = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
  }), [user, isAuthenticated, isLoading]); // 의존성 배열에 상태와 함수를 포함합니다. (함수는 useCallback으로 감싸는 것이 더 좋지만, 이 예제에서는 단순화)

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// 5. 커스텀 훅 생성 (`useUser`)
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

