import { useState, useEffect } from 'react';
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
// Posters are loaded dynamically via import.meta.glob below
// import poster4 from '../assets/poster4.jpeg';
// import poster5 from '../assets/poster5.png';
// import { useNavigate } from 'react-router-dom';
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

  // Dynamically import all poster images matching poster*.{png,jpg,jpeg}
  const posterModules = import.meta.glob('../assets/poster*.{png,PNG,jpg,JPG,jpeg,JPEG}', { eager: true });
  const posters = Object
    .entries(posterModules)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, mod]) => (mod && mod.default) ? mod.default : mod);
  // Fallback: if none matched, keep previous three if any existed
  // (No-op in current setup because at least poster1~ are present)
  // Preload poster images early to avoid blank gap at sequence boundary
  useEffect(() => {
    posters.forEach((src) => {
      const img = new Image();
      img.src = typeof src === 'string' ? src : String(src);
    });
  }, [posters]);

  // Delay animation start until key images are loaded to avoid visible gaps
  const [loadedCount, setLoadedCount] = useState(0);
  const eagerCount = posters.length + 5; // first loop + next 5 images
  const preloadThreshold = Math.min(eagerCount, posters.length * 2);
  const isCarouselReady = loadedCount >= Math.min(preloadThreshold, 8);
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

  // const navigate = useNavigate();
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

  // const borderStyle = {
  //   boxShadow: "0 0 0 2px #444, 0 0 0 5px #222, 0 0 1px 5px #000",
  // };



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
          <div className="flex relative z-20 flex-col items-start px-4">
            {/* <span className="text-6xl font-bold text-blue-200" style={{ fontFamily: 'Russo One, sans-serif' }}>CAPS</span> */}
            <img
              src={logoBright}
              alt="CAPS Logo"
              className="mb-4 w-36 md:w-48" />
            <span className="mt-4 text-lg font-medium text-white md:text-2xl break-keep md:break-normal">Computer Aided Progressive Study</span>
            <span className="mt-2 text-sm text-white md:text-base break-keep md:break-normal">
              1988년 창설된 CAPS는 프로그래밍에 관심이 있는 누구나 재밌게 배울 수 있는 동아리입니다
            </span>
          </div>
          {/* 아래쪽 화살표 */}
          <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
            {/* <span className="text-3xl text-white animate-bounce">⌄</span> */}
            <img src={arrow} alt="arrow" className="w-8 md:w-10" />
          </div>
        </div>
        <br />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col justify-center items-center px-4 w-full min-h-screen snap-start"
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
                className="mr-2 w-12 md:w-16" /> 는
            </div>

            <div className="flex flex-col items-center mt-2 max-w-2xl text-center">
              <span className="text-5xl md:text-7xl font-[NotoSansKR] text-gray-300 leading-none">“</span>
              <p className="text-base md:text-2xl font-[Pretendard] font-regular text-black mb-6 leading-relaxed break-keep md:break-normal">
                다양한 전공의 학생들이 함께 활동하며 <br />전공간의 경계를 허물고,<br />
                창의적 시각으로 복잡한 문제에 접근할 수 있는<br />
                프로그래밍 학술 활동을 추구합니다.
              </p>
              <span className="text-5xl md:text-7xl font-[NotoSansKR] text-gray-300 leading-none mb-4">”</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col justify-center items-center px-4 w-full min-h-screen bg-gray-100 snap-start"
        >
          <div className="px-2 py-16 w-full">
            <div className="flex flex-col items-center mx-auto max-w-6xl">

              <div className=" text-sm md:text-xl font-[Pretendard] font-semibold text-gray-500 mb-4 text-center">
                1988년부터 시작 되어 39년의 역사를 가진 캡스는 현재
              </div>
              <div className="text-2xl md:text-3xl font-[Pretendard] font-bold text-gray-800 mb-10 text-center">
                <span className="text-blue-500">{departments.length}</span> 개의 학과, 총 <span className="text-blue-600">224</span> 명의 학우와 <br />함께하고 있습니다.
                <div className="text-xs font-medium text-gray-400">2025년 1학기 기준</div>
              </div>


              {/* 윗줄 왼→오 (오른쪽으로 이동) */}
              <div className="mb-3 h-10 md:h-12 marquee">
                <div className="marquee-track animate-marquee-right">
                  {doubleDepartments1.map((dept, idx) => (
                    <span
                      key={`d1-${idx}`}
                      className="inline-block px-4 py-2 mx-2 text-sm text-gray-700 bg-white rounded-lg shadow-sm md:px-5 md:text-lg"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              {/* 아랫줄 오→왼 (왼쪽으로 이동) */}
              <div className="h-10 md:h-12 marquee">
                <div className="marquee-track animate-marquee-left">
                  {doubleDepartments2.map((dept, idx) => (
                    <span
                      key={`d2-${idx}`}
                      className="inline-block px-4 py-2 mx-2 text-sm text-gray-700 bg-white rounded-lg shadow-sm md:px-5 md:text-lg"
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
          className="flex flex-col justify-center items-center px-4 pt-10 pb-32 w-full min-h-[130vh] sm:min-h-[120vh] md:min-h-screen snap-start"
        >
          {/* 설명 */}
          <div className="flex flex-col items-center mb-8 w-full">
            <div className="mb-2 text-xs font-bold text-center text-gray-500 md:text-sm">
              캡스는 어떤 활동을 하나요?
            </div>
            <div className="text-base font-bold leading-tight text-center text-gray-700 md:text-xl break-keep md:break-normal">
              프로그래밍 스터디 · 세미나 · 알고리즘 대회 · MT · 게임대회까지<br />
              다양한 활동을 즐길 수 있습니다.
            </div>
          </div>
          {/* 탭 */}
          <div className="flex justify-center items-center mb-6 w-full border-b border-gray-700 md:mb-8">
            <button
              className={
                "px-4 md:px-6 py-2 font-semibold text-sm md:text-base focus:outline-none transition " +
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
                "px-4 md:px-6 py-2 font-semibold text-sm md:text-base focus:outline-none transition " +
                (tab === "social"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400")
              }
              onClick={() => setTab("social")}
            >
              친목 활동
            </button>
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 justify-items-stretch items-start w-full md:grid-cols-2 md:gap-x-6 md:gap-y-8">
            {(tab === "learn" ? LEARN_CARDS : SOCIAL_CARDS).map((card, i) => (
              <div
                key={i}
                className="relative bg-white rounded-xl w-full h-[200px] md:h-[240px] overflow-hidden group cursor-pointer max-w-[420px] md:max-w-none"
              >
                <img src={card.image} alt={card.title} className="object-cover w-full h-full" />
                {/* 호버 오버레이 */}
                <div className="flex absolute inset-0 flex-col justify-between p-8 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-70">
                  <div className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h3 className="mb-2 text-2xl font-bold md:text-3xl">{card.title}</h3>
                  </div>
                  <div className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-xs leading-relaxed md:text-sm break-keep md:break-normal">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* extra spacer to ensure last row fully scrolls into view on very small phones */}
          <div className="h-10 md:h-0" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col justify-center items-center px-4 pt-10 w-full min-h-screen snap-start"
        >
          <div className="text-base font-bold leading-tight text-center text-gray-700 md:text-xl break-keep md:break-normal">
            교내 활동뿐만 아니라,<br /> 전교생을 대상으로 한 알고리즘대회 등<br />
            다양한 행사에 기여하며 활동 범위를 넓혀가고 있습니다.
          </div>
          <div className="overflow-hidden py-16 w-full">
            <div className={`flex gap-8 items-center w-max ${isCarouselReady ? 'animate-scroll' : ''}`}>
              {[...posters, ...posters].map((src, i) => (
                <img
                  key={`loop-${i}-${src}`}
                  src={src}
                  alt={`활동 이미지 ${(i % posters.length) + 1}`}
                  loading={i < eagerCount ? "eager" : "lazy"}
                  fetchPriority={i < eagerCount ? "high" : undefined}
                  decoding={i < eagerCount ? "sync" : "async"}
                  sizes="(min-width: 768px) 16rem, 10rem"
                  className="object-contain w-40 bg-gray-100 rounded-lg md:w-64 shrink-0"
                  onLoad={() => {
                    if (i < eagerCount) setLoadedCount((c) => c + 1);
                  }}
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
          className="flex flex-col justify-center items-center px-4 py-16 w-full min-h-screen text-center md:py-24 snap-start"
        >
          {/* 메인 메시지 */}
          <div className="mb-4 text-xl font-extrabold text-center text-gray-800 md:text-3xl">
            캡스의 프로그래밍 꿈나무가 되어 1987년의 역사를 이어가주세요.
          </div>
          {/* 서브 메시지 */}
          <div className="mb-10 text-base font-semibold text-center text-gray-500 md:text-xl">
            아직은 지원기간이 아니에요!
          </div>
          {/* 버튼 */}
          <button className="flex gap-2 items-center px-8 py-4 text-lg font-extrabold text-white bg-blue-600 rounded-full shadow-lg transition md:px-12 md:py-5 md:text-xl hover:bg-blue-500 active:bg-blue-700">
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
