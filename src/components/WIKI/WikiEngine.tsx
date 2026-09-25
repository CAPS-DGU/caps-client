import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactDiffViewer from "react-diff-viewer-continued";
import { parseContent, sanitizeHtml } from "./wikiParser";
import WikiDocument from "./WikiDocument";
import { useAuth } from "../../hooks/useAuth";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { toRelativeTime } from "../../utils/Time";
import { User } from "../../types/common";

interface WikiEngineProps {
  author?: User;
  DocTitle: string;
  content: string;
  notFoundFlag?: boolean;
  history?: string;
  prevContent?: string;
}

const WikiEngine: React.FC<WikiEngineProps> = ({
  author,
  DocTitle,
  content,
  notFoundFlag,
  history,
  prevContent,
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isContentVisible, setIsContentVisible] = useState(
    history === undefined,
  );
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { width } = useWindowDimensions();

  const { tocList } = useMemo(() => parseContent(content), [content]);

  useEffect(() => {
    const redirectToHashPage = (text: string) => {
      const firstLine =
        text
          .split(/\r?\n/)
          .find((line) => line.trim().length > 0)
          ?.trim() ?? "";
      const match = /^#(\S+)/.exec(firstLine);
      if (match) {
        const targetPage = firstLine.slice(1).trim();
        setTimeout(() => {
          navigate(`/wiki/${targetPage}`);
        }, 500);
      }
    };

    redirectToHashPage(content);
  }, [content, navigate]);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const editButton = (
    <div className="flex space-x-4">
      <>
        {isLoggedIn && (
          <Link
            to={`/wiki/edit/${DocTitle}`}
            className="px-4 py-2 text-white bg-gray-600 rounded-md shadow-md hover:bg-gray-700"
          >
            수정
          </Link>
        )}
        <Link
          to={`/wiki/history/${DocTitle}`}
          className="px-4 py-2 text-white bg-gray-600 rounded-md shadow-md hover:bg-gray-700"
        >
          수정 내역
        </Link>
      </>
    </div>
  );

  return (
    <div className="max-w-3xl p-6 mx-auto bg-white rounded-md shadow-md">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-4xl font-semibold text-gray-700">
          {DocTitle}{" "}
          {history ? (
            <span className="inline text-xl text-gray-400">
              {toRelativeTime(history) +
                `에 ${author?.grade ?? ""}기 ${author?.name ?? ""}이(가) 작성했습니다.`}
            </span>
          ) : null}
        </h1>
        {notFoundFlag ? null : editButton}
      </div>

      {tocList.length > 0 && (!history || isContentVisible) && (
        <div className="w-full p-4 mb-6 bg-gray-100 rounded-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">목차</h2>
          <ul className="pl-6 text-lg text-gray-600 list-decimal">
            {tocList.map((section) => (
              <li
                key={section.id}
                className={`mb-2 list-none ${activeSection === section.id ? "text-red-500" : ""}`}
                style={{ paddingLeft: `${(section.level - 2) * 20}px` }}
              >
                <a
                  id={`toc_${section.number}`}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSectionClick(section.id);
                  }}
                  className="text-blue-500 hover:underline"
                >
                  {section.number + "." + " "}
                </a>
                <span
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(section.subtitle),
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {history && (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setIsContentVisible(!isContentVisible)}
            className="px-4 py-2 text-white bg-gray-600 rounded-md shadow-md hover:bg-gray-700"
          >
            {isContentVisible ? "본문 숨기기" : "본문 보기"}
          </button>
          <button
            type="button"
            onClick={() => setIsHistoryVisible(!isHistoryVisible)}
            className="px-4 py-2 ml-4 text-white bg-gray-600 rounded-md shadow-md hover:bg-gray-700"
          >
            {isHistoryVisible ? "변경사항 숨기기" : "변경사항 보기"}
          </button>
        </div>
      )}

      {isContentVisible && <WikiDocument content={content} />}

      {isHistoryVisible && (
        <ReactDiffViewer
          oldValue={prevContent ?? ""}
          newValue={content}
          splitView={width > 768}
          hideLineNumbers={width <= 768}
        />
      )}
    </div>
  );
};

export default WikiEngine;
