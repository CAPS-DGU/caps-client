import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken } from "../utils/cookie";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const hasToken = !!getAccessToken();

  if (!hasToken) {
    alert("잘못된 접근입니다.");
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;

