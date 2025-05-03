import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import useTokenManager from '../components/LoginSession/TokenManager'; // TokenManager 불러오기

const LoginPage = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { startTokenRefreshTimer } = useTokenManager(); // TokenManager에서 가져오기

  const onKakaoLogin = () => {

    window.location.href = "https://api.dgucaps.shop/oauth2/authorization/kakao"
  }


  return (
    <div
      className="flex items-center justify-center"
      style={{ marginTop: '10vh' }}
    >
      <button onClick={onKakaoLogin}>Kakao login</button>

    </div>
  );
};

export default LoginPage;
