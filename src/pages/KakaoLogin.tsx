import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import kakaologinbutton from "../assets/kakao_login.svg";
import Navbar from "../components/NavBar";

interface LoginErrors {
  id?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center h-screen-temp">
        <button
          onClick={() => {
            window.location.href =
              "https://api.dgucaps.shop/oauth2/authorization/kakao";
          }}
        >
          <img
            src={kakaologinbutton}
            alt="Kakao Login"
            className="mt-20 h-16"
          />
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
