import React, { useEffect, useState } from 'react';
import homeImage from '../assets/home.png';
import logo from '../assets/logo.png';
import logoBright from '../assets/logo-bright.png';
import intro1 from '../assets/intro1.png';
import intro2 from '../assets/intro2.jpg';
import intro3 from '../assets/intro3.png';
import intro4 from '../assets/intro4.png';
import poster1 from '../assets/poster1.jpg';
import poster2 from '../assets/poster2.png';
import poster3 from '../assets/poster3.png';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/MainPage/Footer';
import { motion } from "framer-motion";
import arrow from '../assets/u_angle-double-down.png';
import Navbar from '../components/NavBar';

function shuffleArray(array) {
  return array
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
}


const MainPage = () => {
  const departments = [
    "정보통신공학과",
    "경영정보학과",
    "산업시스템공학과",
    "컴퓨터공학과",
    "통계학과",
    "수학과",
    "AI소프트웨어융합학부(컴퓨터공학전공)",
    "약학과",
    "AI소프트웨어융합학부",
    "AI소프트웨어융합학부(인공지능전공)",
    "법학과",
    "융합보안학과",
    "가정교육과",
    "멀티미디어공학과",
    "반도체과학전공",
    "AI소프트웨어융합학부(데이터사이언스전공)",
    "한국음악과",
    "건설환경공학과",
    "멀티미디어소프트웨어공학과",
    "생명과학과",
    "전자전기공학부",
    "국제통상학과",
    "컴퓨터AI학부",
    "열린전공학부"
  ];

  const navigate = useNavigate();
  // useEffect(() => {
  //   navigate('/wiki');
  // }, []);
  const [tab, setTab] = useState("learn");
  const LEARN_CARDS = [
    {
      title: "자유 발표",
      description: "자유 발표는 캡스의 활동 중 하나로, 학생들이 자유롭게 발표를 할 수 있는 활동입니다.",
      image: intro1,
    },
    {
      title: "알고리즘 대회",
      description: "알고리즘 대회는 캡스의 활동 중 하나로, 학생들이 자유롭게 알고리즘 대회를 할 수 있는 활동입니다.",
      image: intro2,
    },
    {
      title: "졸업자 초청 강연",
      description: "졸업자 초청 강연은 캡스의 활동 중 하나로, 학생들이 자유롭게 졸업자 초청 강연을 할 수 있는 활동입니다.",
      image: intro3,
    },
    {
      title: "알고리즘 대회",
      description: "알고리즘 대회는 캡스의 활동 중 하나로, 학생들이 자유롭게 알고리즘 대회를 할 수 있는 활동입니다.",
      image: intro4,
    },
  ];  // 예시 데이터
  const SOCIAL_CARDS = [ {
    title: "자유 발표",
    description: "자유 발표는 캡스의 활동 중 하나로, 학생들이 자유롭게 발표를 할 수 있는 활동입니다.",
    image: intro1,
  },
  {
    title: "알고리즘 대회",
    description: "알고리즘 대회는 캡스의 활동 중 하나로, 학생들이 자유롭게 알고리즘 대회를 할 수 있는 활동입니다.",
    image: intro2,
  },
  {
    title: "세미나",
    description: "세미나는 캡스의 활동 중 하나로, 학생들이 자유롭게 세미나를 할 수 있는 활동입니다.",
    image: intro3,
  },
  {
    title: "알고리즘 대회",
    description: "알고리즘 대회는 캡스의 활동 중 하나로, 학생들이 자유롭게 알고리즘 대회를 할 수 있는 활동입니다.",
    image: intro4,
  },]; // 예시 데이터

  const borderStyle = {
    boxShadow: "0 0 0 2px #444, 0 0 0 5px #222, 0 0 1px 5px #000",
  };



  const shuffled = shuffleArray(departments);
  const mid = Math.ceil(shuffled.length / 2);

  const departments1 = shuffled.slice(0, mid);
  const departments2 = shuffled.slice(mid);

  // 한 줄의 학과 정보를 2번 반복한 배열로 만들어 무한루프 효과
  const doubleDepartments1 = [...departments1, ...departments1];
  const doubleDepartments2 = [...departments2, ...departments2];



  return (
    <>
      <div className="bg-[#FAFAFA] snap-y snap-mandatory overflow-y-auto h-screen">
        {/* <img src={homeImage} alt="설명적인 이미지 텍스트" /> */}
        {/* <Navbar /> */}
        <div className="relative w-full snap-start min-h-screen flex items-center justify-center overflow-hidden">
          <Navbar isTransparent={true} />
         
          {/* 배경 이미지 */}
          <img
            src={homeImage}
            alt="caps background"
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          />

          {/* 오버레이(그라디언트) */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/80 z-10" />

          {/* 텍스트 레이어 */}
          <div className="relative z-20 flex flex-col items-start px-10">
            {/* <span className="text-6xl font-bold text-blue-200" style={{ fontFamily: 'Russo One, sans-serif' }}>CAPS</span> */}
            <img
              src={logoBright}
              alt="CAPS Logo"
              className="w-48 mb-4" />
            <span className="mt-4 text-2xl font-medium text-white">Computer Aided Progressive Study</span>
            <span className="mt-2 text-base text-white">
              1988년 창설된 CAPS는 프로그래밍에 관심이 있는 누구나 재밌게 배울 수 있는 동아리입니다
            </span>
          </div>
          {/* 아래쪽 화살표 */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            {/* <span className="text-white text-3xl animate-bounce">⌄</span> */}
            <img src={arrow} alt="arrow" className="w-10" />
          </div>
        </div>
        <br />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full snap-start min-h-screen flex flex-col justify-center items-center"
        >
          <div className="flex flex-col items-center w-full pt-8 pb-20 bg-white">
            {/* CAPS 텍스트 로고 */}
            <div className="flex items-baseline mb-3">
              {/* <span */}
              {/*   className="text-[56px] font-bold text-[#18384E] mr-2" */}
              {/*   style={{ fontFamily: 'Russo One, sans-serif' }} */}
              {/* > */}
              {/*   CAPS */}
              {/* </span> */}
              <img
                src={logo}
                alt="CAPS Logo"
                className="w-16 mr-2" /> 는
            </div>

            <div className="flex flex-col items-center max-w-2xl text-center mt-2">
              <span className="text-7xl font-[NotoSansKR] text-gray-300 leading-none">“</span>
              <p className="text-2xl font-[Pretendard] font-regular text-black mb-6">
                다양한 전공의 학생들이 함께 활동하며 전공간의 경계를 허물고,<br />
                창의적 시각으로 복잡한 문제에 접근할 수 있는<br />
                프로그래밍 학술 활동을 추구합니다.
              </p>
              <span className="text-7xl font-[NotoSansKR] text-gray-300 leading-none mb-4">”</span>
            </div>
          </div>

          <div className="bg-gray-100 w-full py-16 px-2">
            <div className="max-w-6xl mx-auto flex flex-col items-center">

              <div className="text-xl font-[Pretendard] font-semibold text-gray-500 mb-4">
                1988년부터 시작 되어 39년의 역사를 가진 캡스는 현재
              </div>
              <div className="text-3xl font-[Pretendard] font-bold md:text-4xl font-bold text-gray-800 mb-10 text-center">
                2025년 1학기 기준 <span className="text-blue-500">{departments.length}</span> 개의 학과, 총 <span className="text-blue-600">243</span> 명의 학우와 함께하고 있습니다.
              </div>


              {/* 윗줄 왼→오 (오른쪽으로 이동) */}
              <div className="marquee mb-3 h-12">
                <div className="marquee-track animate-marquee-right">
                  {doubleDepartments1.map((dept, idx) => (
                    <span
                      key={`d1-${idx}`}
                      className="bg-white mx-2 px-5 py-2 rounded-lg text-gray-700 shadow-sm text-lg inline-block"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              {/* 아랫줄 오→왼 (왼쪽으로 이동) */}
              <div className="marquee h-12">
                <div className="marquee-track animate-marquee-left">
                  {doubleDepartments2.map((dept, idx) => (
                    <span
                      key={`d2-${idx}`}
                      className="bg-white mx-2 px-5 py-2 rounded-lg text-gray-700 shadow-sm text-lg inline-block"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full snap-start min-h-screen flex flex-col justify-center items-center pt-10"
        >
          {/* 설명 */}
          <div className="w-full flex flex-col items-center mb-8">
            <div className="text-gray-400 text-center mb-2 text-sm">
              캡스는 어떤 활동을 하나요?
            </div>
            <div className="text-gray-700 font-bold text-xl text-center leading-tight">
              프로그래밍 스터디 · 세미나 · 알고리즘 대회 · MT · 게임대회까지<br />
              다양한 활동을 즐길 수 있습니다.
            </div>
          </div>
          {/* 탭 */}
          <div className="flex w-full items-center justify-center border-b border-gray-700 mb-8">
            <button
              className={
                "px-6 py-2 font-semibold text-base focus:outline-none transition " +
                (tab === "learn"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400")
              }
              onClick={() => setTab("learn")}
            >
              학습 활동
            </button>
            <button
              className={
                "px-6 py-2 font-semibold text-base focus:outline-none transition " +
                (tab === "social"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400")
              }
              onClick={() => setTab("social")}
            >
              친목 활동
            </button>
          </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-10">
              {(tab === "learn" ? LEARN_CARDS : SOCIAL_CARDS).map((card, i) => (
                <div
                  key={i}
                  className="relative bg-white rounded-xl w-[360px] h-[240px] overflow-hidden group cursor-pointer"
                >
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                  {/* 호버 오버레이 */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex flex-col justify-between p-8">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-3xl font-bold mb-2">{card.title}</h3>
                    </div>
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full snap-start min-h-screen flex flex-col justify-center items-center pt-10"
        >
          <div className="text-gray-700 font-bold text-xl text-center leading-tight">
            교내 활동뿐만 아니라, 전교생을 대상으로 한 알고리즘대회 등<br />
            다양한 행사에 기여하며 활동 범위를 넓혀가고 있습니다.
          </div>
            <div className="w-full overflow-hidden py-16">
            <div className="flex animate-scroll space-x-8">
              {Array(6).fill(null).map((_, index) => (
                <img 
                  key={index}
                  src={index % 3 === 0 ? poster1 : index % 3 === 1 ? poster2 : poster3} 
                  alt={`활동 이미지 ${index + 1}`} 
                  className="w-64 object-contain rounded-lg" 
                />
              ))}
            </div>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full snap-start min-h-screen py-24 flex flex-col justify-center items-center"
        >
          {/* 메인 메시지 */}
          <div className="text-[2rem] md:text-[2.5rem] font-extrabold text-gray-800 text-center mb-4">
            캡스의 프로그래밍 꿈나무가 되어 1987년의 역사를 이어가주세요.
          </div>
          {/* 서브 메시지 */}
          <div className="text-xl text-gray-500 font-semibold text-center mb-10">
            아직은 지원기간이 아니에요!
          </div>
          {/* 버튼 */}
          <button className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition text-white font-extrabold text-xl px-12 py-5 rounded-full flex items-center gap-2 shadow-lg">
            모집 알림 신청하기
            <svg className="w-7 h-7 ml-2" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </motion.section>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full snap-start min-h-screen bg-[#333] flex flex-col justify-center items-center"
        >  
          <Footer />
        </motion.div>
      </div>
    </>
  );
};

export default MainPage;
