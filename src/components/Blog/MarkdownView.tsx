import React from "react";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import BlogImage from "./BlogImage";

interface MarkdownViewProps {
  content: string;
  className?: string;
}

/**
 * 제출 전 본문 인라인 이미지 blob: URL(로컬 미리보기)을 허용한다.
 */
function urlTransform(url: string): string {
  return /^blob:/i.test(url) ? url : defaultUrlTransform(url);
}

/**
 * 블로그 본문(마크다운)을 렌더한다. 작성폼 Preview 와 상세페이지에서 공용으로 쓴다.
 * 본문 이미지는 S3 key 로 저장되므로 img 는 BlogImage 로 렌더해 presign 을 거친다.
 * (react-markdown 은 HTML 을 이스케이프하므로 dangerouslySetInnerHTML 없이 안전하다)
 */
const MarkdownView: React.FC<MarkdownViewProps> = ({ content, className }) => {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={urlTransform}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-8 mb-4 text-2xl md:text-3xl font-extrabold leading-snug text-black">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-7 mb-3 text-xl md:text-2xl font-bold leading-snug text-black">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-2 text-lg font-bold text-black">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="my-3 text-[15px] leading-8 text-gray-800">{children}</p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#007AEB] underline underline-offset-2 hover:text-[#0069cc]"
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="my-3 list-disc space-y-1 pl-6 text-[15px] leading-8 text-gray-800 marker:text-gray-400">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 list-decimal space-y-1 pl-6 text-[15px] leading-8 text-gray-800 marker:text-gray-400">
              {children}
            </ol>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-[#007AEB]/40 bg-[#007AEB]/5 py-2 pl-4 pr-2 text-gray-600">
              {children}
            </blockquote>
          ),
          code: ({ className: cls, children }) => {
            const isBlock = /language-/.test(cls ?? "");
            if (isBlock) return <code className={`${cls ?? ""} font-mono`}>{children}</code>;
            return (
              <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[13px] text-[#d6336c]">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-4 overflow-x-auto rounded-xl bg-gray-900 p-4 text-[13px] leading-6 text-gray-100">
              {children}
            </pre>
          ),
          hr: () => <hr className="my-6 border-gray-200" />,
          img: ({ src, alt }) => (
            <BlogImage
              src={typeof src === "string" ? src : undefined}
              alt={alt ?? ""}
              className="my-4 max-h-[520px] w-auto max-w-full rounded-xl"
              fallback={
                <span className="my-4 block rounded-xl bg-gray-100 px-4 py-8 text-center text-sm text-gray-400">
                  이미지를 불러올 수 없습니다
                </span>
              }
            />
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-bold text-gray-700">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-200 px-3 py-2 text-gray-800">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownView;
