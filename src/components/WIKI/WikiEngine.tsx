import React, { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface WikiEngineProps {
  content: string;
  className?: string;
}

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

export const WikiEngine: React.FC<WikiEngineProps> = ({
  content,
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
        <span class="comment-box absolute left-1/2 transform -translate-x-1/2 top-6 bg-gray-800 text-white text-sm p-2 rounded-md shadow-md hidden z-10">${commentText.trim()}</span>
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

  return (
    <div
      className={`prose max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

export default WikiEngine;
