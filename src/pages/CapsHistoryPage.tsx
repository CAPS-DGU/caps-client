import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
import logo from "../assets/logo.png";

const historyData = [
  {
    year: "1988",
    events: [
      "1월 학술학회 C.A.P.S설립 (초대 회장 87학번 변태경)",
    ],
  },
  {
    year: "1989",
    events: [
      "2월 2대 집행부 결성 (2대 회장 88학번 고석훈)",
      "7월 제 1회 NCA 전시회 참가",
    ],
  },
  {
    year: "1990",
    events: [
      "1월 3대 집행부 결성 (3대 회장 89학번 이태원)",
      "8월 제 1회 현대전자 경진대회 및 공모전 참가",
      "10월 전국 퍼스널 컴퓨터 경진대회 참가",
    ],
  },
  {
    year: "1991",
    events: [
      "1월 4대 집행부 결성 (4대 회장 90학번 김민경)",
      "3월 C.A.P.S 창간호 발간",
      "5월 제 1회 C.A.P.S 소프트웨어 전시회 개최",
      "9월 C.A.P.S 학술지 2호 발간",
    ],
  },
  {
    year: "1992",
    events: [
      "1월 5대 집행부 결성 (5대 회장 91학번 심성훈)",
      "4월 C.A.P.S 학술지 3호 발간",
      "5월 제 2회 C.A.P.S 소프트웨어 전시회 개최",
    ],
  },
  {
    year: "1993",
    events: [
      "1월 6대 집행부 결성 (6대 회장 92학번 박재현, 진종욱)",
      "5월 제 3회 C.A.P.S 소프트웨어 전시회 개최",
      "8월 제 4회 현대전자 경진대회 및 공모전 - 대상",
      "12월 7대 집행부 결성 (7대 회장 93학번 김동진)",
    ],
  },
  {
    year: "1994",
    events: [
      "5월 제 4회 C.A.P.S 소프트웨어 전시회 개최",
      "12월 8대 집행부 결성 (8대 회장 94학번 김진곤)",
    ],
  },
  {
    year: "1995",
    events: [
      "12월 9대 집행부 결성 (9대 회장 95학번 이희원)",
    ],
  },
  {
    year: "1996",
    events: [
      "12월 10대 집행부 결성 (10대 회장 96학번 노상래)",
    ],
  },
  {
    year: "1997",
    events: [
      "12월 11대 집행부 결성 (11대 회장 97학번 고영관)",
    ],
  },
  {
    year: "1998",
    events: [
      "5월 제 5회 C.A.P.S 소프트웨어 전시회 개최",
      "12월 12대 집행부 결성 (12대 회장 98학번 남동근)",
    ],
  },
  {
    year: "1999",
    events: [
      "10월 제 6회 C.A.P.S 소프트웨어 전시회 개최",
      "12월 13대 집행부 결성 (13대 회장 99학번 김인중)",
    ],
  },
  {
    year: "2000",
    events: [
      "10월 제 7회 C.A.P.S 소프트웨어 전시회 개최",
      "12월 14대 집행부 결성 (14대 회장 00학번 정수영)",
    ],
  },
  {
    year: "2001",
    events: [
      "12월 15대 집행부 결성 (15대 회장 01학번 이지현)",
    ],
  },
  {
    year: "2002",
    events: [
      "3월 제 8회 C.A.P.S 소프트웨어 전시회 개최",
      "11월 제 9회 C.A.P.S 소프트웨어 전시회 개최",
      "12월 16대 집행부 결성 (16대 회장 02학번 남유근)",
    ],
  },
  {
    year: "2003",
    events: [
      "11월 제 10회 C.A.P.S 소프트웨어 전시회 개최",
      "12월 17대 집행부 결성 (17대 회장 03학번 이광원)",
    ],
  },
  {
    year: "2004",
    events: [
      "11월 제 11회 C.A.P.S 소프트웨어 전시회 개최",
      "12월 18대 집행부 결성 (18대 회장 04학번 박윤준)",
    ],
  },
  {
    year: "2005",
    events: [
      "11월 제 12회 C.A.P.S 소포트웨어 전시회 개최",
      "12월 19대 집행부 결성 (19대 회장 05학번 김민식)",
    ],
  },
  {
    year: "2006",
    events: [
      "12월 제 13회 C.A.P.S 소프트웨어 전시회 개최",
      "12월 20대 집행부 결성 (20대 회장 06학번 윤재구)",
    ],
  },
  {
    year: "2007",
    events: [
      "12월 21대 집행부 결성 (21대 회장 07학번 이지선)",
    ],
  },
  {
    year: "2008",
    events: [
      "9월 제 14회 C.A.P.S 소프트웨어 전시회 개최",
      "12월 22대 집행부 결성 (22대 회장 08학번 도혜미)",
    ],
  },
  {
    year: "2009",
    events: [
      "12월 23대 집행부 결성 (23대 회장 09학번 차윤제)",
    ],
  },
  {
    year: "2010",
    events: [
      "12월 24대 집행부 결성 (24대 회장 10학번 안성훈)",
    ],
  },
  {
    year: "2011",
    events: [
      "12월 25대 집행부 결성 (25대 회장 11학번 박선영)",
    ],
  },
  {
    year: "2012",
    events: [
      "12월 26대 집행부 결성 (26대 회장 08학번 이호빈)",
    ],
  },
  {
    year: "2013",
    events: [
      "12월 27대 집행부 결성 (27대 회장 13학번 왕인내)",
    ],
  },
  {
    year: "2014",
    events: [
      "12월 28대 집행부 결성 (28대 회장 14학번 김창규)",
    ],
  },
  {
    year: "2015",
    events: [
      "10월 마이크로소프트 홍보대사 발탁",
      "12월 29대 집행부 결성 (29대 회장 15학번 장성은)",
    ],
  },
  {
    year: "2016",
    events: [
      "12월 30대 집행부 결성 (30대 회장 16학번 명지수)",
    ],
  },
  {
    year: "2017",
    events: [
      "3월 제 15회 C.A.P.S 소프트웨어 전시회 개최",
    ],
  },
  {
    year: "2018",
    events: [
      "1월 31대 집행부 결성(31대 회장 15학번 김태경)",
      "4월 제 16회 C.A.P.S 소프트웨어 전시회 개최",
    ],
  },
  {
    year: "2019",
    events: [
      "1월 32대 집행부 결성(32대 회장 18학번 임연지)",
    ],
  },
  {
    year: "2020",
    events: [
      "1월 33기 집행부 결성(33대 회장 19학번 정윤섭)",
      "6월 33.5기 집행부 결성(33.5대 회장 19학번 이지환)",
      "12월 34기 집행부 결성(34대 회장 20학번 제보민)",
    ],
  },
  {
    year: "2022",
    events: [
      "1월 35기 집행부 결성(35대 회장 21학번 하유경)",
      "2월 제 17회 C.A.P.S 소프트웨어 전시회 개최",
      "7월 35.5기 집행부 결성(35.5대 회장 21학번 주현욱)",
    ],
  },
  {
    year: "2023",
    events: [
      "4월 36기 집행부 결성(36대 회장 21학번 박서영)",
      "?월 동국대학교 중앙동아리 학술분과로 승격"
    ],
  },
  {
    year: "2024",
    events: [
      "1월 37기 집행부 결성(37대 회장 20학번 허상준)",
      "5월 26일 제 1회 C.A.P.S 알고리즘 대회 개최",
      "7월 29일 제 1회 CAPSthon 대회 개최",
      "11월 23일 제 2회 C.A.P.S 알고리즘 대회 개최",
    ],
  },
  {
    year: "2025",
    events: [
      "?월 UCPC (전국 대학생 프로그래밍 대회 동아리 연합회) 가입",
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
