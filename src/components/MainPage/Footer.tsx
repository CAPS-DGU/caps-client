import React from 'react';
import logoBright from '../../assets/logo-bright.png';

function Footer() {
  return (
    <>
      <footer className="bg-[#333] py-16 w-full flex flex-col items-center">
        {/* CAPs 로고 */}
        <img src={logoBright} alt="CAPS Logo" className="w-24 mb-6" />
        <br className="md:hidden" />
        {/* 인스타/링크트리/문의하기 */}
        <div className="md:flex items-center justify-center gap-12 text-gray-200 text-lg mb-8">
          <a href="https://www.instagram.com/caps_dongguk" className="flex items-center gap-2 hover:text-blue-300 transition">
            {/* instagram icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="2 2 20 20" className="w-6 h-6" stroke="currentColor"><rect width="16" height="16" x="4" y="4" rx="4" stroke="#ccc" strokeWidth="2" /><circle cx="12" cy="12" r="4" stroke="#ccc" strokeWidth="2" /><circle cx="16.5" cy="7.5" r="1.5" fill="#ccc" /></svg>
            공식 인스타그램
          </a>
          <br className="md:hidden" />
          <a href="https://linktr.ee/dgu_caps" className="flex items-center gap-2 hover:text-blue-300 transition">
            {/* linktree icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6" viewBox="0 0 22 22"><path d="M11 19V3m0 0L6 8m5-5 5 5" stroke="#ccc" /><path d="M7 13l4 6 4-6" stroke="#ccc" /></svg>
            링크트리
          </a>
          <br className="md:hidden" />
          <a href="mailto:caps.dongguk@gmail.com" className="flex items-center gap-2 hover:text-blue-300 transition">
            {/* mail icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="2 2 20 20" stroke="currentColor" className="w-6 h-6"><rect width="16" height="12" x="4" y="6" rx="2" stroke="#ccc" strokeWidth="2" /><path d="m6 8 6 6 6-6" stroke="#ccc" strokeWidth="2" /></svg>
            문의하기
          </a>
          <br className="md:hidden" />
          <a href="/faq" className="flex items-center gap-2 hover:text-blue-300 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 28 28" className="w-7 h-7" stroke="currentColor">
              <circle cx="14" cy="14" r="12" stroke="#ccc" strokeWidth="2" fill="none"/>
              <text x="14" y="19" textAnchor="middle" fontSize="16" fill="#ccc" fontFamily="Arial" fontWeight="bold">?</text>
            </svg>
            자주 묻는 질문
          </a>
        </div>

        {/* 구분선 */}
        <div className="w-full border-t border-gray-400 mb-7"></div>

        {/* 주소 */}
        <div className="text-gray-300 text-sm flex items-center justify-center gap-2">
          {/* 위치 아이콘 */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" className="inline align-middle mr-1 mb-0.5" stroke="#bbb" viewBox="0 0 24 24"><path d="M12 21s-6-5.686-6-10A6 6 0 0 1 18 11c0 4.314-6 10-6 10Z" strokeWidth="2" /><circle cx="12" cy="11" r="2" strokeWidth="2" /></svg>
          서울특별시 중구 필동로1길 30 동국대학교 원흥관 E265호
        </div>
      </footer>
    </>
  );
}

export default Footer;

