import React from "react";
import { Link } from "react-router-dom";

interface MainPageLink {
  to: string;
  text: string;
  description: string;
}

const links: MainPageLink[] = [
  {
    to: "/wiki",
    text: "CAPS 위키",
    description: "CAPS의 모든 정보를 공유하고 편집할 수 있는 위키입니다.",
  },
  {
    to: "/study",
    text: "스터디",
    description: "스터디를 만들고 참여할 수 있습니다.",
  },
  {
    to: "/library",
    text: "도서관",
    description: "CAPS의 도서를 검색하고 대여할 수 있습니다.",
  },
  {
    to: "/gallery",
    text: "갤러리",
    description: "CAPS의 사진과 영상을 공유할 수 있습니다.",
  },
  {
    to: "/vote",
    text: "투표",
    description: "투표를 만들고 참여할 수 있습니다.",
  },
];

const MainPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.to}
            className="flex flex-col items-center p-6 transition-transform duration-200 transform bg-white rounded-lg shadow-md hover:scale-105"
          >
            <h2 className="mb-2 text-xl font-bold text-gray-800">
              {link.text}
            </h2>
            <p className="text-center text-gray-600">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
