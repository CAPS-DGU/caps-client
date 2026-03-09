import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/MainPage/Footer";
import executives from "../data/aboutUs/executives";
import type { Department } from "../types/aboutUs";
const profileImg = new URL("../assets/profile.png", import.meta.url).href;

const rawProfileImages = (
  import.meta as unknown as {
    glob: (
      pattern: string,
      options: { eager: true; import: "default" }
    ) => Record<string, string>;
  }
).glob("../assets/profiles/*.jpeg", { eager: true, import: "default" });

const profileImages = Object.entries(rawProfileImages).reduce<
  Record<string, string>
>((acc, [key, value]) => {
  const nfcKey = key.normalize("NFC");
  const nfdKey = key.normalize("NFD");
  acc[key] = value;
  acc[nfcKey] = value;
  acc[nfdKey] = value;
  return acc;
}, {});

const getProfileImg = (filename?: string) => {
  if (!filename) {
    return profileImg;
  }
  const key = `../assets/profiles/${filename}`;
  return (
    profileImages[key] ??
    profileImages[key.normalize("NFC")] ??
    profileImages[key.normalize("NFD")] ??
    profileImg
  );
};

type DepartmentConfig = {
  tab: string;
  loader: () => Promise<Department>;
};

const departmentConfigs: DepartmentConfig[] = [
  {
    tab: "학술부",
    loader: () =>
      import("../data/aboutUs/departments/academics").then((m) => m.default),
  },
  {
    tab: "기획부",
    loader: () =>
      import("../data/aboutUs/departments/planning").then((m) => m.default),
  },
  {
    tab: "총무부",
    loader: () =>
      import("../data/aboutUs/departments/finance").then((m) => m.default),
  },
  {
    tab: "편집부",
    loader: () =>
      import("../data/aboutUs/departments/editorial").then((m) => m.default),
  },
  {
    tab: "대외협력부",
    loader: () =>
      import("../data/aboutUs/departments/external").then((m) => m.default),
  },
  {
    tab: "홈페이지관리부",
    loader: () =>
      import("../data/aboutUs/departments/web").then((m) => m.default),
  },
];

const AboutUs: React.FC = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [departments, setDepartments] =
    React.useState<Partial<Record<number, Department>>>({});

  React.useEffect(() => {
    let cancelled = false;

    if (departments[selectedTab]) {
      return;
    }

    departmentConfigs[selectedTab]
      .loader()
      .then((department) => {
        if (cancelled) {
          return;
        }
        setDepartments((prev) =>
          prev[selectedTab] ? prev : { ...prev, [selectedTab]: department }
        );
      })
      .catch((err) => {
        console.error("Failed to load department data", err);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedTab, departments]);

  const currentDepartment = departments[selectedTab];

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <Navbar />
      <div className="pt-20 max-w-4xl mx-auto pb-20">
        <div className="text-center mt-8">
          <div className="text-xs text-gray-400 mb-1">제 38.5대 집행부</div>
          <div className="text-lg font-bold mb-2">
            모두가 참여할 수 있는 활동을 추구하는 집행부를 소개합니다!
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
                src={getProfileImg(ex.img)}
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
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 md:gap-3 py-1 px-1 justify-center">
              {departmentConfigs.map((dep, idx) => {
                const active = selectedTab === idx;
                return (
                  <button
                    key={dep.tab}
                    onClick={() => setSelectedTab(idx)}
                    className={`whitespace-nowrap px-4 md:px-5 py-2 rounded-full text-sm md:text-base font-semibold transition-colors duration-200 border
                      ${
                        active
                          ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                          : "bg-white text-blue-600 border-blue-300 hover:bg-blue-50"
                      }
                    `}
                    style={{ outline: "none", boxShadow: "none" }}
                  >
                    {dep.tab}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-4 justify-items-center">
            {!currentDepartment ? (
              <div className="col-span-3 text-gray-400 text-center py-8">
                집행부 정보를 불러오는 중입니다...
              </div>
            ) : currentDepartment.members.length === 0 ? (
              <div className="col-span-3 text-gray-400 text-center py-8">
                아직 집행부원이 등록되지 않았습니다.
              </div>
            ) : (
              currentDepartment.members.map((member, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="relative mb-2">
                    <img
                      src={getProfileImg(member.img)}
                      alt={member.name}
                      className="w-32 h-32 rounded-full shadow"
                    />
                    {member.isLeader && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl">
                        👑
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-base font-bold flex items-center">
                    {member.isLeader && (
                      <span className="mr-1 text-yellow-500">👑</span>
                    )}
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
