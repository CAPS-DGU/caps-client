import React from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { WikiContent } from "../components/WIKI/WikiContent";
import WikiSearch from "../components/WIKI/WikiSearch";
import WikiRecent from "../components/WIKI/WikiRecent";
import { useWiki } from "../hooks/useWiki";
import { WikiData } from "../types/wiki";

// Default wiki data for the home page
const wikiIntroData: WikiData = {
  title: "대문",
  content: `[[CAPS 위키]]에 오신 것을 환영합니다!
[[CAPS]] 회원이라면 원하는 문서를 생성 및 편집할 수 있습니다.
더 자세한 내용은 [[CAPS 위키]], [[도움말]]을 참고하시기 바랍니다.

<div class="bg-gray-200 p-4 border-2 border-gray-300 rounded-xl">||[[도움말]] || CAPS 위키를 어떻게 써야할 지 모르겠다면 도움말을 클릭하세요!</div>
<div class="bg-gray-200 p-4 border-2 border-gray-300 rounded-xl ">||[[CAPS 위키 프로젝트]] 진행 중!! || 프로젝트에 참여해서 관련 문서에 기여의 손길을 보내주세요!</div>
<div class="bg-gray-200 p-4 border-2 border-gray-300 rounded-xl">||[[C언어 프로젝트]] 진행 중!! || 2024-여름학기 동안 C언어 및 여러가지 위키 페이지를 작성하고 수정하고 싶습니다! 같이 하실분 구해요~</div>
`,
  writer: "CAPS",
  time: new Date().toISOString(),
};

// Not found data template
const createNotFoundData = (title: string): WikiData => ({
  title: title,
  content: `<div>해당 문서가 없습니다.</div> <a class="text-blue-500 hover:underline" href='/wiki/edit/${title}'>새 문서 만들기</a>`,
  writer: "CAPS",
  time: new Date().toISOString(),
});

const WikiPage: React.FC = () => {
  const { wiki_title } = useParams<{ wiki_title: string }>();
  const { wikiData, loading, error } = useWiki(wiki_title);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Spin size="large" />
      </div>
    );
  }

  // Determine which data to display
  const displayData = wiki_title
    ? wikiData || createNotFoundData(wiki_title)
    : wikiIntroData;

  return (
    <div className="container p-4 mx-auto">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-3">
          <WikiContent data={displayData} />
        </div>
        <div className="md:col-span-1">
          <div className="sticky top-4">
            <WikiSearch />
            <div className="mt-4">
              <WikiRecent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WikiPage;
