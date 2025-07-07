import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
import logo from "../assets/logo.png";

const historyData = [
  {
    year: "1988",
    events: [
      "정보통신공학과 소모임으로 CAPS 설립",
    ],
  },
  {
    year: "2023",
    events: [
      "동국대학교 중앙동아리 학술분과로 승격",
    ],
  },
  {
    year: "2024",
    events: [
      "제2회 동국대학교 프로그래밍 경진대회 개최",
      "다음 연혁",
      "디다슨 연혁",
    ],
  },
  {
    year: "2025",
    events: [
      "UCPC (전국 대학생 프로그래밍 대회 동아리 연합회) 가입",
      "CAPS 39기 / 신입부원 000명 모집",
    ],
  },
];

const Timeline = () => (
  <div className="relative max-w-2xl mx-auto pt-24 pb-20">
    {/* 세로 파란 줄 */}
    <div className="absolute left-1 top-0 h-full w-3 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full z-0" />
    <ul className="space-y-16 relative z-10">
      {historyData.map((item, idx) => (
        <li key={item.year} className="flex items-start relative">
          {/* 연도와 점 */}
          <div className="flex flex-col items-center mr-8">
            <div
              className="w-5 h-5 rounded-full border-4 border-black bg-white z-10"
              style={{ boxShadow: "0 0 0 4px #fff" }}
            />
          </div>
          {/* 연도 및 내용 */}
          <div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{item.year}</div>
            <ul className="ml-1">
              {item.events.map((event, i) => (
                <li key={i} className="text-base text-gray-700 mb-1">{event}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ul>
    
  </div>
);

const CapsHistoryPage: React.FC = () => {
  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto pb-20">
        <div className="pt-20 pb-8 text-center">
          <div className="text-3xl font-bold mb-2"><span className="inline-block mr-2"><img src={logo} alt="logo" className="w-16 mx-auto" /></span> 연혁</div>
          <div className="text-gray-500">동국대학교 CAPS의 주요 연혁을 소개합니다.</div>
        </div>
        <Timeline />
      </div>
      <Footer />
    </div>
  );
};

export default CapsHistoryPage;
