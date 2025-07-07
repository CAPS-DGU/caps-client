import React from 'react';
import logoGradient from '../../assets/logo-gradient.png';
import kakaologinbutton from '../../assets/kakao_login.svg';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onKakaoLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onKakaoLogin }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl p-8 w-[340px] relative shadow-xl">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="닫기"
        >×</button>
        <img src={logoGradient} alt="CAPS" className="w-24 mb-4" />
        <div className="text-xl font-bold text-gray-900 text-start mb-2">캡스에<br/>오신 것을 환영해요!</div>
        <div className="text-gray-400 text-start mb-6 text-sm">로그인하고 캡스를 더 재밌게 즐겨보세요.</div>
        <button
          className="w-full flex items-center justify-center mt-2"
          onClick={onKakaoLogin}
        >
          <img src={kakaologinbutton} alt="Kakao Login" className="h-12 w-auto" />
        </button>
      </div>
    </div>
  );
};

export default LoginModal; 