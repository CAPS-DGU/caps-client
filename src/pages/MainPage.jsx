import React, { useEffect, useState } from 'react';
import homeImage from '../assets/home.png';
import logo from '../assets/logo.png';
import logoBright from '../assets/logo-bright.png';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/MainPage/Footer';

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
  const LEARN_CARDS = Array(6).fill({});  // 예시 데이터
  const SOCIAL_CARDS = Array(6).fill({}); // 예시 데이터

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
      <div>
        {/* <img src={homeImage} alt="설명적인 이미지 텍스트" /> */}
        <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
          {/* 배경 이미지 */}
          <img
            src={homeImage}
            alt="caps background"
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          />

          {/* 오버레이(어둡게) */}
          {/* <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10" /> */}

          {/* 텍스트 레이어 */}
          <div className="relative z-20 flex flex-col items-start px-10">
            {/* <span className="text-6xl font-bold text-blue-200" style={{ fontFamily: 'Russo One, sans-serif' }}>CAPS</span> */}
            <img
              src={logoBright}
              alt="CAPS Logo"
              className="w-48 mb-4" />
            <span className="mt-4 text-2xl font-semibold text-white">Computer Aided Progressive Study</span>
            <span className="mt-2 text-base text-white">
              1988년 창설된 CAPS는 프로그래밍에 관심이 있는 누구나 재밌게 배울 수 있는 동아리입니다
            </span>
          </div>
          {/* 아래쪽 화살표 */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <span className="text-white text-3xl animate-bounce">⌄</span>
          </div>
        </div>
        <br />
        <div>
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
              <p className="text-2xl font-[Pretendard] font-bold text-black mb-6">
                다양한 전공의 학생들이 함께 활동하며 전공간의 경계를 허물고,
                창의적 시각으로 복잡한 문제에 접근할 수 있는
                프로그래밍 학술 활동을 추구합니다.
              </p>
              <span className="text-7xl font-[NotoSansKR] text-gray-300 leading-none mb-4">”</span>
            </div>
          </div>
        </div>


        <div>
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

        </div>

        <div className="w-full min-h-screen flex flex-col items-center pt-10 pb-32">
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
          {/* 카드 그리드 */}
          <div className="grid grid-cols-3 gap-x-10 gap-y-10">
            {(tab === "learn" ? LEARN_CARDS : SOCIAL_CARDS).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl w-[210px] h-[210px] flex items-center justify-center"
              >
                {/* 이곳에 이미지/아이콘/텍스트 등 넣을 수 있음 */}
              </div>
            ))}
          </div>
        </div>
        <section className="w-full py-24 flex flex-col items-center">
          {/* 메인 메시지 */}
          <div className="text-[2rem] md:text-[2.5rem] font-extrabold text-gray-800 text-center mb-4">
            캡스의 프로그래밍 꿈나무가 되어 1988년의 역사를 이어가주세요.
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
        </section>
        <Footer />
      </div>
    </>
  );
};

export default MainPage;
