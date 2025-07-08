import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";

const faqData = [
    {
      question: "동아리 활동은 어떤 내용으로 이루어지나요?",
      answer: "동아리 활동은 프로그래밍 기초 및 심화 스터디(C, Python 등), 알고리즘 및 데이터 분석 스터디, 개인/팀 프로젝트 진행, 알고리즘 대회, 외부 IT 행사 참가, 신입부원 세미나(자유 주제 발표) 등으로 이루어집니다."
    },
    {
      question: "동아리 가입 조건, 모집시기, 규모, 회비는 어떻게 되나요?",
      answer: "동국대학교 재학생/휴학생이면 누구나 지원 가능하며, 프로그래밍 경험이 없어도 지원하실 수 있습니다. 매년 3월 초 & 9월 초에 신입부원을 모집하며, 39기는 243명으로 구성되어 있습니다. 동아리 회비는 한 학기 20,000원입니다."
    },
    {
      question: "동아리 활동은 언제, 어디서 하며 주요 행사는 무엇인가요?",
      answer: "주로 원흥관 캡방(동아리방)에서 활동하며, 정기 모임 및 스터디는 학기 중 평일 저녁, 주말 등 구성원 일정에 맞춰 진행됩니다. (필참이 아닙니다) 주요 행사로는 알고리즘 대회, 캡스인의 밤(졸업자 강연, 선후배 교류), 봄/가을 MT, 친목 행사 등이 있습니다."
    },
    {
      question: "동아리에 가입하면 어떤 점이 좋은가요?",
      answer: "동아리에 가입하시면 프로그래밍 실력 향상, 다양한 IT 경험 및 프로젝트 참여, 선후배 네트워크, 진로 정보 공유, 대외활동 및 공모전 참여 기회 등의 이점을 얻으실 수 있습니다."
    },
    {
      question: "동아리 활동이 학업에 지장을 주지 않나요?",
      answer: "동아리 활동은 학업과 병행 가능한 수준으로 운영됩니다. 대부분의 활동은 자율적 참여이며, 필수 참석이 거의 없습니다."
    },
    {
      question: "동아리 선후배 사이 분위기는 어떤가요?",
      answer: "동아리는 자유롭고 수평적 분위기를 가지고 있으며, 선배들이 신입을 적극적으로 도와주는 문화가 있습니다."
    },
    {
      question: "동아리에서 사용하는 주요 소통 방법(단톡방, SNS 등)은 무엇인가요?",
      answer: "주요 소통 방법으로는 카카오톡 단체 채팅방, 인스타그램, CAPS 위키 등 온라인 플랫폼을 활용하고 있습니다."
    },
    {
      question: "동아리 활동을 통해 얻을 수 있는 경험이나 스펙이 있나요?",
      answer: "동아리 활동을 통해 공모전, 대외활동, 프로젝트 경험, 알고리즘 대회, 스터디 참여 경력, IT 관련 실무 역량 및 네트워크 등을 얻으실 수 있습니다."
    },
    {
      question: "동아리에서 외부 활동(봉사, 대회 등)도 하나요?",
      answer: "알고리즘 대회, 해커톤, 외부 IT 행사에 참가하며, 봉사활동보다는 IT 관련 외부활동을 중심으로 진행합니다."
    },
    {
      question: "동아리 가입 시 면접이 있나요?",
      answer: "간단한 면접과 지원서 심사가 진행되며, 프로그래밍 실력보다는 열정과 관심 위주로 평가합니다."
    },
    {
      question: "동아리 활동 외에 친목 활동도 있나요?",
      answer: "MT, 캡쳐, 친목 모임 등 다양한 친목 행사가 있습니다."
    },
    {
      question: "졸업생과의 교류가 있나요?",
      answer: "캡스인의 밤, 졸업자 강연 등을 통해 졸업생과 교류하고 있습니다."
    },
    {
      question: "정말 아무것도 몰라도 지원 가능한가요?",
      answer: "완전 초보도 지원 가능하며, 기초부터 함께 배울 수 있습니다."
    },
    {
      question: "정기 모임이 있나요? 필참인가요?",
      answer: "신입생 세미나(입회 후 1회)는 필참입니다. 다른 활동은 대부분 자율적 참여이며, 정기 모임 및 스터디가 운영됩니다. 필참 여부는 활동별로 다를 수 있습니다."
    }
  ];

  export default function FAQPage() {
    return (
      <div>
        <Navbar />
        <div className="h-16"></div>
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">FAQ</h1>
        </div>

        <div className="max-w-2xl mx-auto mt-8">
          {faqData.map((faq, idx) => (
            <details
              key={idx}
              className="mb-4 border border-gray-200 rounded-lg bg-white shadow-sm transition-all"
            >
              <summary className="cursor-pointer px-6 py-4 text-lg font-semibold text-blue-900 hover:bg-blue-50 rounded-lg transition-colors">
                {faq.question}
              </summary>
              <div className="px-6 py-4 text-gray-700 border-t bg-blue-50 rounded-b-lg">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
        <div className="h-16"></div>
        <Footer />
      </div>
    )
  }