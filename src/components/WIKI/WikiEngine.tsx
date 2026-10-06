import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import ReactDiffViewer from "react-diff-viewer-continued";
import { parseContent, sanitizeHtml } from "./wikiParser";
import WikiDocument from "./WikiDocument";
import { useAuth } from "../../hooks/useAuth";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { toRelativeTime } from "../../utils/Time";
import { User } from "../../types/common";

const displayTitle = (title: string) => title.replace(/\+/g, " ");

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
  const location = useLocation();
  const { wiki_title } = useParams();
  // Display aliases may look identical, but the server distinguishes + from spaces.
  const currentTitle = DocTitle;
  const routeMatches = (wiki_title ?? "대문") === currentTitle;
  const redirectState = location.state?.wikiRedirect;
  const redirectFrom = routeMatches && redirectState?.to === currentTitle &&
    typeof redirectState?.from === "string" ? redirectState.from : null;
  const redirectPath: string[] = useMemo(() =>
    redirectFrom && Array.isArray(redirectState?.path)
      ? redirectState.path.filter((title: unknown) => typeof title === "string") : [],
    [redirectFrom, redirectState],
  );
  const firstLine = content.split(/\r?\n/).find((line) => line.trim())?.trim() ?? "";
  const targetTitle = /^#\S/.test(firstLine) ? firstLine.slice(1).trim() : null;
  const redirectDisabled = new URLSearchParams(location.search).get("redirect") === "no";
  const redirectLoop = !!targetTitle && (targetTitle === currentTitle ||
    redirectPath.includes(targetTitle) || redirectPath.length >= 20);

  const { isLoggedIn } = useAuth();
  const { width } = useWindowDimensions();

  const { tocList } = useMemo(() => parseContent(content), [content]);

  useEffect(() => {
    // Only redirect the document matching the current route, not stale fetch data or history.
    if (history || notFoundFlag || !routeMatches || redirectDisabled || !targetTitle || redirectLoop) return;
    navigate(`/wiki/${encodeURIComponent(targetTitle)}`, {
      replace: true,
      state: { wikiRedirect: {
        from: currentTitle,
        to: targetTitle,
        path: [...redirectPath, currentTitle],
      } },
    });
  }, [history, notFoundFlag, routeMatches, redirectDisabled, targetTitle, redirectLoop,
    currentTitle, redirectPath, navigate]);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const editButton =
    isLoggedIn && !notFoundFlag ? (
      <div
        className="flex shrink-0 flex-wrap gap-2"
        aria-label="위키 문서 관리"
      >
        <Link
          to={`/wiki/edit/${DocTitle}`}
          className="whitespace-nowrap px-4 py-2 text-white bg-gray-600 rounded-md shadow-md hover:bg-gray-700"
        >
          수정
        </Link>
        <Link
          to={`/wiki/history/${DocTitle}`}
          className="whitespace-nowrap px-4 py-2 text-white bg-gray-600 rounded-md shadow-md hover:bg-gray-700"
        >
          수정 내역
        </Link>
      </div>
    ) : null;

  return (
    <div className="min-w-0 max-w-3xl p-4 sm:p-6 mx-auto bg-white rounded-md shadow-md">
      <div className="flex flex-col items-start gap-4 mb-5 sm:flex-row sm:justify-between">
        <h1 className="min-w-0 w-full sm:flex-1 text-3xl sm:text-4xl font-semibold text-gray-700 [overflow-wrap:anywhere]">
          {displayTitle(currentTitle)}{" "}
          {history ? (
            <span className="inline text-xl text-gray-400">
              {toRelativeTime(history) +
                `에 ${author?.grade ?? ""}기 ${author?.name ?? ""}이(가) 작성했습니다.`}
            </span>
          ) : null}
        </h1>
        {editButton}
      </div>

      {!history && redirectFrom && (
        <p className="mb-4 break-words text-sm text-gray-500">
          <Link
            to={`/wiki/${encodeURIComponent(redirectFrom)}?redirect=no`}
            className="text-blue-500 hover:underline"
          >
            {displayTitle(redirectFrom)}
          </Link>에서 넘어옴
        </p>
      )}
      {!history && routeMatches && redirectLoop && !redirectDisabled && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          리다이렉트가 반복되어 이동을 중단했습니다.
        </p>
      )}

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
