import React, { useMemo } from "react";
import FootnoteTooltip from "../common/FootnoteTooltip";
import { parseContent, sanitizeHtml } from "./wikiParser";

/** Convert only sanitized HTML into React elements; all wiki views share this renderer. */
export function renderWikiHtml(html: string, idPrefix = ""): React.ReactNode[] {
  const doc = new DOMParser().parseFromString(sanitizeHtml(html), "text/html");
  const render = (node: Node, key: number): React.ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (!(node instanceof HTMLElement)) return null;
    const commentIndex = node.dataset.commentIndex;
    if (node.tagName === "SUP" && commentIndex && /^\d+$/.test(commentIndex)) {
      const note = node.querySelector(".comment-box");
      return (
        <sup key={key} id={`${idPrefix}comment-ref-${commentIndex}`}>
          <FootnoteTooltip
            href={`#${idPrefix}comment-${commentIndex}`}
            label={`[${commentIndex}]`}
          >
            {note ? Array.from(note.childNodes).map(render) : null}
          </FootnoteTooltip>
        </sup>
      );
    }
    const props: Record<string, unknown> = { key };
    for (const attribute of Array.from(node.attributes)) {
      const { name, value } = attribute;
      if (name === "style") {
        const style: Record<string, string> = {};
        for (const property of Array.from(node.style)) {
          const reactName = property.startsWith("--")
            ? property
            : property.replace(/-([a-z])/g, (_, letter: string) =>
                letter.toUpperCase(),
              );
          style[reactName] = node.style.getPropertyValue(property);
        }
        props.style = style;
      } else if (name === "class") props.className = value;
      else if (name === "id") props.id = idPrefix + value;
      else if (name === "href" && value.startsWith("#"))
        props.href = `#${idPrefix}${value.slice(1)}`;
      else props[name] = value;
    }
    return React.createElement(
      node.tagName.toLowerCase(),
      props,
      ...Array.from(node.childNodes).map(render),
    );
  };
  return Array.from(doc.body.childNodes).map(render);
}

export default function WikiDocument({
  content,
  idPrefix = "",
}: {
  content: string;
  idPrefix?: string;
}) {
  const { htmlContent, commentList } = useMemo(
    () => parseContent(content),
    [content],
  );
  const body = useMemo(
    () => renderWikiHtml(htmlContent, idPrefix),
    [htmlContent, idPrefix],
  );
  return (
    <>
      <div className="wiki-content">{body}</div>
      {commentList.length > 0 && (
        <section className="mt-10" aria-label="주석">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">주석</h2>
          <ol className="pl-6 text-lg text-gray-600">
            {commentList.map((comment, index) => (
              <li
                key={index}
                id={`${idPrefix}comment-${index + 1}`}
                className="mb-2 list-none scroll-mt-24"
              >
                <a
                  href={`#${idPrefix}comment-ref-${index + 1}`}
                  className="text-blue-500 hover:underline"
                >
                  [{index + 1}]
                </a>{" "}
                {renderWikiHtml(comment, idPrefix)}
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
