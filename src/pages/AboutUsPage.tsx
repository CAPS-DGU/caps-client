import React from "react";
import Navbar from "../components/NavBar";
import profileImg from "../assets/profile.png";
import Footer from "../components/MainPage/Footer";

const executives = [
  {
    role: "회장",
    name: "37기 신효관",
    position: "컴퓨터AI학부",
    img: profileImg,
  },
  {
    role: "부회장",
    name: "38기 성준영",
    position: "수학과",
    img: profileImg,
  },
];

const departments = [
  {
    tab: "학술부",
    members: [
      {
        name: "38기 손한솔",
        position: "컴퓨터AI학부",
        img: profileImg,
        isLeader: true,
      },
      {
        name: "38.5기 안재준",
        position: "컴퓨터AI학부",
        img: profileImg,
      },
      {
        name: "38.5기 이강민",
        position: "데이터사이언스전공",
        img: profileImg,
      },
      {
        name: "39기 김영모",
        position: "컴퓨터AI학부",
        img: profileImg,
      },
      {
        name: "38.5기 강주영",
        position: "융합보안학과",
        img: profileImg,
      },
      {
        name: "38.5기 이은서",
        position: "컴퓨터AI학부",
        img: profileImg,
      },
    ],
  },
  {
    tab: "기획부",
    members: [],
  },
  {
    tab: "총무부",
    members: [],
  },
  {
    tab: "편집부",
    members: [],
  },
  {
    tab: "홈페이지 관리부",
    members: [],
  },
];

const AboutUs: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <Navbar />
      <div className="pt-20 max-w-4xl mx-auto pb-20">
        <div className="text-center mt-8">
          <div className="text-xs text-gray-400 mb-1">제 ??대 집행부</div>
          <div className="text-lg font-bold mb-2">
            ???????? 를 추구하는 머시기 집행부를 소개합니다!
          </div>
        </div>
        {/* 회장/부회장 */}
        <div className="flex justify-center gap-16 mt-8">
          {executives.map((ex, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`text-white text-xs px-4 py-1 rounded-full mb-2 ${
                  ex.role === "회장" ? "bg-blue-500" : "bg-[#6C8DFF]"
                }`}
              >
                {ex.role}
              </div>
              <img
                src={ex.img}
                alt={ex.name}
                className="w-32 h-32 rounded-full shadow"
              />
              <div className="mt-2 text-base font-semibold">{ex.name}</div>
              <div className="text-xs text-gray-500">{ex.position}</div>
            </div>
          ))}
        </div>

        {/* 부서 탭 및 멤버 */}
        <div className="mt-12 bg-[#007AEB] bg-opacity-5 rounded-3xl p-10 overflow-hidden">
          <div className="flex justify-center mb-8">
            <div className="flex w-full max-w-3xl bg-white rounded-full border-2 border-blue-400">
              {departments.map((dep, idx) => (
                <button
                  key={dep.tab}
                  className={`flex-1 py-3 font-bold text-base transition rounded-full mx-4
                    ${selectedTab === idx
                      ? "bg-blue-500 text-white"
                      : "bg-white text-blue-500"}
                    ${idx === 0 ? "ml-0" : ""}
                    ${idx === departments.length - 1 ? "mr-0" : ""}
                  `}
                  onClick={() => setSelectedTab(idx)}
                  style={{outline: 'none', border: 'none', boxShadow: 'none'}}
                >
                  {dep.tab}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-4 justify-items-center">
            {departments[selectedTab].members.length === 0 ? (
              <div className="col-span-3 text-gray-400 text-center py-8">
                아직 집행부원이 등록되지 않았습니다.
              </div>
            ) : (
              departments[selectedTab].members.map((member, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="relative mb-2">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-32 h-32 rounded-full shadow"
                    />
                    {member.isLeader && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">👑</span>
                    )}
                  </div>
                  <div className="mt-1 text-base font-bold flex items-center">
                    {member.isLeader && <span className="mr-1 text-yellow-500">👑</span>}
                    {member.name}
                  </div>
                  <div className="text-sm text-gray-500">{member.position}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;

