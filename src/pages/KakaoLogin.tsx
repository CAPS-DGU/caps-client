
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface LoginErrors {
  id?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  const loginFunction = async () => {
    try {
      const response = await axios.post("/api/auth/login", {
        userId: id,
        password: password,
      });
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        window.location.href = "/";
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        alert(err.response.data.details);
      }
      throw err;
    }
  };




  return (
    <div className="flex items-center justify-center h-screen">
      <button onClick={() => {
        window.location.href = "https://api.dgucaps.shop/oauth2/authorization/kakao";
      }
      }>Kakao Login</button>
    </div>
  );
};

export default LoginPage;
