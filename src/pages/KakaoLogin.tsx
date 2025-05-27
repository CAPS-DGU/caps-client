
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import kakaologinbutton from "../assets/kakao_login.svg";

interface LoginErrors {
  id?: string;
  password?: string;
}

const LoginPage: React.FC = () => {

  return (
    <div className="flex items-center justify-center h-screen-temp">
      <button onClick={() => {
        window.location.href = "https://api.dgucaps.shop/oauth2/authorization/kakao";
      }
      }>
        <img
          src={kakaologinbutton}
          alt="Kakao Login"
          className="h-16 mt-20"
        />
      </button>
    </div>
  );
};

export default LoginPage;
