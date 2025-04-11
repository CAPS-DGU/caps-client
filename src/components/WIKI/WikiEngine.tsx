import React, { useMemo, useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { User } from "../../types/common";

// 허용된 HTML 태그 목록
const ALLOWED_TAGS = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "a",
  "strong",
  "em",
  "code",
  "pre",
  "blockquote",
  "div",
  "span",
  "br",
  "hr",
  "sup",
];

// 허용된 HTML 속성 목록
const ALLOWED_ATTR = ["href", "class", "id", "style", "data-comment-index"];

interface WikiLink {
  text: string;
  href: string;
}

interface WikiContentProps {
  author?: User;
  DocTitle: string;
  content: string;
  notFoundFlag?: boolean;
  history?: any;
  prevContent?: string;
  className?: string;
}

const WikiEngine: React.FC<WikiContentProps> = ({
  author,
  DocTitle,
  content,
  notFoundFlag,
  history,
  prevContent,
  className = "",
}) => {
  const processedContent = useMemo(() => {
    // 주석 목록을 저장할 배열
    const commentList: string[] = [];

    // 위키 링크를 HTML로 변환
    const wikiLinkRegex = /\[\[(.*?)\]\]/g;
    let processedText = content.replace(wikiLinkRegex, (match, linkText) => {
      const [text, href] = linkText.split("|").map((s) => s.trim());
      return `<a href="/wiki/${
        href || text
      }" class="text-blue-500 hover:underline">${text}</a>`;
    });

    // 주석을 HTML로 변환
    const commentRegex = /\{\{(.+?)\}\}/g;
    processedText = processedText.replace(
      commentRegex,
      (match, commentText) => {
        const commentIndex = commentList.length + 1;
        commentList.push(commentText.trim());

        return `<sup class="comment-ref text-blue-500 hover:underline cursor-pointer relative" id="comment-ref-${commentIndex}" data-comment-index="${commentIndex}">
        <a href="#comment-${commentIndex}" class="text-blue-500 hover:underline cursor-pointer">[${commentIndex}]</a>
        <div class="comment-box-container" data-display="none">
          <div class="comment-box bg-gray-800 text-white text-sm p-2 rounded-md shadow-md"><span>${commentText.trim()}</span></div>
        </div>
      </sup>`;
      }
    );

    // 마크다운을 HTML로 변환
    const htmlContent = marked.parse(processedText) as string;

    // HTML 정리 (허용된 태그와 속성만 남김)
    const sanitizedHtml = DOMPurify.sanitize(htmlContent, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
    });

    // 주석 목록 추가
    let finalHtml = sanitizedHtml;
    if (commentList.length > 0) {
      finalHtml +=
        '<div class="mt-8 pt-4 border-t border-gray-200"><h3 class="text-lg font-semibold mb-2">주석</h3><ol class="list-decimal pl-5">';
      commentList.forEach((comment, index) => {
        finalHtml += `<li id="comment-${
          index + 1
        }" class="mb-2"><a href="#comment-ref-${
          index + 1
        }" class="text-blue-500 hover:underline">[${
          index + 1
        }]</a> ${comment}</li>`;
      });
      finalHtml += "</ol></div>";
    }

    return finalHtml;
  }, [content]);

  useEffect(() => {
    // 주석 박스 표시/숨김 처리
    const handleCommentHover = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const commentRef = target.closest(".comment-ref");
      const commentBoxContainer = target.closest(".comment-box-container");

      if (commentRef) {
        const container = commentRef.querySelector(".comment-box-container");
        if (container) {
          container.setAttribute("data-display", "block");
        }
      } else if (commentBoxContainer) {
        commentBoxContainer.setAttribute("data-display", "block");
      }
    };

    const handleCommentLeave = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const commentRef = target.closest(".comment-ref");
      const commentBoxContainer = target.closest(".comment-box-container");

      if (commentRef && !commentRef.contains(event.relatedTarget as Node)) {
        const container = commentRef.querySelector(".comment-box-container");
        if (container) {
          container.setAttribute("data-display", "none");
        }
      } else if (
        commentBoxContainer &&
        !commentBoxContainer.contains(event.relatedTarget as Node)
      ) {
        commentBoxContainer.setAttribute("data-display", "none");
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener("mouseover", handleCommentHover);
    document.addEventListener("mouseout", handleCommentLeave);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("mouseover", handleCommentHover);
      document.removeEventListener("mouseout", handleCommentLeave);
    };
  }, []);

  return (
    <div
      className={`prose max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

export default WikiEngine;
