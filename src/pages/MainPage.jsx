import React, { useEffect, useState } from 'react';
import homeImage from '../assets/home.png';
import logo from '../assets/logo.png';
import logoBright from '../assets/logo-bright.png';
import intro1 from '../assets/intro1.png';
import intro2 from '../assets/intro2.jpg';
import intro3 from '../assets/intro3.png';
import intro4 from '../assets/intro4.png';
import intro5 from '../assets/intro5.png';
import intro6 from '../assets/intro6.png';
import intro7 from '../assets/intro7.png';
import intro8 from '../assets/intro8.png';
import poster1 from '../assets/poster1.jpg';
import poster2 from '../assets/poster2.png';
import poster3 from '../assets/poster3.png';
import poster4 from '../assets/poster4.jpeg';
import poster5 from '../assets/poster5.png';
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
      title: "스터디",
      description: "강의형/관리형/프로젝트형 세 가지 유형이 있고, 원하는 분야를 선택하여 참여할 수 있습니다.",
      image: intro1,
    },
    {
      title: "CAPStone",
      description: "팀을 이루어 직접 기획부터 구현까지 프로젝트를 완성해보는 실전형 프로그램입니다.",
      image: intro2,
    },
    {
      title: "알고리즘 대회",
      description: "CAPS에서 출제한 알고리즘 문제를 해결하고, 풀이를 나누며 문제 해결력을 기를 수 있습니다.",
      image: intro3,
    },
    {
      title: "졸업생 초청강연",
      description: "CAPS를 졸업하신 선배님들의 학업과 취직에 대한 경험담과 조언을 들을 수 있는 시간입니다.",
      image: intro4,
    },
  ];  // 예시 데이터
  const SOCIAL_CARDS = [{
    title: "개강총회/종강총회",
    description: "한 학기 활동 계획과 집행부를 소개해 드리고, 뒷풀이를 통해 신입 부원들을 환영합니다.",
    image: intro5,
  },
  {
    title: "세미나",
    description: "자유로운 주제로 발표를 준비해 이야기를 들려주며 서로를 알아가는 자리입니다.",
    image: intro6,
  },
  {
    title: "캡처",
    description: "신입 부원과 기존 부원들의 친목 도모를 위해 조별로 대면 모임을 가집니다.",
    image: intro7,
  },
  {
    title: "MT",
    description: "펜션에서 레크레이션 게임을 즐기고, 맛있는 음식을 먹으며 빠르게 친해질 수 있습니다.",
    image: intro8,
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
        <div className="flex overflow-hidden relative justify-center items-center w-full min-h-screen snap-start">
          <Navbar isTransparent={true} />

          {/* 배경 이미지 */}
          <img
            src={homeImage}
            alt="caps background"
            className="object-cover absolute top-0 left-0 z-0 w-full h-full"
          />

          {/* 오버레이(그라디언트) */}
          <div className="absolute top-0 left-0 z-10 w-full h-full bg-gradient-to-b from-transparent to-black/90" />

          {/* 텍스트 레이어 */}
          <div className="flex relative z-20 flex-col items-start">
            {/* <span className="text-6xl font-bold text-blue-200" style={{ fontFamily: 'Russo One, sans-serif' }}>CAPS</span> */}
            <img
              src={logoBright}
              alt="CAPS Logo"
              className="mb-4 w-48" />
            <span className="mt-4 text-2xl font-medium text-white">Computer Aided Progressive Study</span>
            <span className="mt-2 text-white text-medium">
              1988년 창설된 CAPS는 프로그래밍에 관심이 있는 누구나 재밌게 배울 수 있는 동아리입니다
            </span>
          </div>
          {/* 아래쪽 화살표 */}
          <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
            {/* <span className="text-3xl text-white animate-bounce">⌄</span> */}
            <img src={arrow} alt="arrow" className="w-10" />
          </div>
        </div>
        <br />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col justify-center items-center w-full min-h-screen snap-start"
        >
          <div className="flex flex-col items-center pt-8 w-full">
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
                className="mr-2 w-16" /> 는
            </div>

            <div className="flex flex-col items-center mt-2 max-w-2xl text-center">
              <span className="text-7xl font-[NotoSansKR] text-gray-300 leading-none">“</span>
              <p className="text-2xl font-[Pretendard] font-regular text-black mb-6">
                다양한 전공의 학생들이 함께 활동하며 전공간의 경계를 허물고,<br />
                창의적 시각으로 복잡한 문제에 접근할 수 있는<br />
                프로그래밍 학술 활동을 추구합니다.
              </p>
              <span className="text-7xl font-[NotoSansKR] text-gray-300 leading-none mb-4">”</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col justify-center items-center w-full min-h-screen bg-gray-100 snap-start"
        >
          <div className="px-2 py-16 w-full">
            <div className="flex flex-col items-center mx-auto max-w-6xl">

              <div className="text-xl font-[Pretendard] font-semibold text-gray-500 mb-4">
                1988년부터 시작 되어 39년의 역사를 가진 캡스는 현재
              </div>
              <div className="text-3xl font-[Pretendard] font-bold md:text-3xl font-bold text-gray-800 mb-10 text-center">
                2025년 1학기 기준 <span className="text-blue-500">{departments.length}</span> 개의 학과, 총 <span className="text-blue-600">224</span> 명의 학우와 함께하고 있습니다.
              </div>


              {/* 윗줄 왼→오 (오른쪽으로 이동) */}
              <div className="mb-3 h-12 marquee">
                <div className="marquee-track animate-marquee-right">
                  {doubleDepartments1.map((dept, idx) => (
                    <span
                      key={`d1-${idx}`}
                      className="inline-block px-5 py-2 mx-2 text-lg text-gray-700 bg-white rounded-lg shadow-sm"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              {/* 아랫줄 오→왼 (왼쪽으로 이동) */}
              <div className="h-12 marquee">
                <div className="marquee-track animate-marquee-left">
                  {doubleDepartments2.map((dept, idx) => (
                    <span
                      key={`d2-${idx}`}
                      className="inline-block px-5 py-2 mx-2 text-lg text-gray-700 bg-white rounded-lg shadow-sm"
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
          className="flex flex-col justify-center items-center pt-10 w-full min-h-screen snap-start"
        >
          {/* 설명 */}
          <div className="flex flex-col items-center mb-8 w-full">
            <div className="mb-2 text-sm text-center text-gray-400">
              캡스는 어떤 활동을 하나요?
            </div>
            <div className="text-xl font-bold leading-tight text-center text-gray-700">
              프로그래밍 스터디 · 세미나 · 알고리즘 대회 · MT · 게임대회까지<br />
              다양한 활동을 즐길 수 있습니다.
            </div>
          </div>
          {/* 탭 */}
          <div className="flex justify-center items-center mb-8 w-full border-b border-gray-700">
            <button
              className={
                "px-6 py-2 font-semibold text-base focus:outline-none transition " +
                (tab === "learn"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400")
              }
              onClick={() => setTab("learn")}
            >
              학술 활동
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
                <img src={card.image} alt={card.title} className="object-cover w-full h-full" />
                {/* 호버 오버레이 */}
                <div className="flex absolute inset-0 flex-col justify-between p-8 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-70">
                  <div className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h3 className="mb-2 text-3xl font-bold">{card.title}</h3>
                  </div>
                  <div className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
          className="flex flex-col justify-center items-center pt-10 w-full min-h-screen snap-start"
        >
          <div className="text-xl font-bold leading-tight text-center text-gray-700">
            교내 활동뿐만 아니라, 전교생을 대상으로 한 알고리즘대회 등<br />
            다양한 행사에 기여하며 활동 범위를 넓혀가고 있습니다.
          </div>
          <div className="overflow-hidden py-16 w-full">
            <div className="flex space-x-8 animate-scroll">
              {Array(12).fill(null).map((_, index) => (
                <img
                  key={index}
                  src={index % 3 === 0 ? poster1 : index % 3 === 1 ? poster2 : poster3}
                  alt={`활동 이미지 ${index + 1}`}
                  className="object-contain w-64 rounded-lg"
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
          className="flex flex-col justify-center items-center py-24 w-full min-h-screen snap-start"
        >
          {/* 메인 메시지 */}
          <div className="mb-4 text-2xl font-extrabold text-center text-gray-800 md:text-3xl">
            캡스의 프로그래밍 꿈나무가 되어 1987년의 역사를 이어가주세요.
          </div>
          {/* 서브 메시지 */}
          <div className="mb-10 text-xl font-semibold text-center text-gray-500">
            아직은 지원기간이 아니에요!
          </div>
          {/* 버튼 */}
          <button className="flex gap-2 items-center px-12 py-5 text-xl font-extrabold text-white bg-blue-600 rounded-full shadow-lg transition hover:bg-blue-500 active:bg-blue-700">
            모집 알림 신청하기
            <svg className="ml-2 w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
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
