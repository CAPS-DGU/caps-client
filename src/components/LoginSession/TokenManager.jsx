import axios from "axios";

const useTokenManager = () => {
  const startTokenRefreshTimer = () => {
    const tokenExpiryTime = 10*60 * 1000;
    setTimeout(refreshAccessToken, tokenExpiryTime - 60 * 1000);
  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await axios.post(
        '/api/token/renewal',
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          }
        }
      );

      if (response.status !== 200) {
        throw new Error('토큰 재발급 실패');
      }

      const data = response.data;
      const { accessToken } = data;

      localStorage.setItem('accessToken', accessToken);
      startTokenRefreshTimer();
    } catch (error) {
      console.error('토큰 재발급 중 에러 발생:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      alert('로그아웃되었습니다. 다시 로그인해주세요.');
    }
  };

  return { startTokenRefreshTimer };
};

export default useTokenManager;
