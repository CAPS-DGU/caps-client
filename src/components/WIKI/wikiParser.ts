import DOMPurify from "dompurify";
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
  "b",
  "i",
  "u",
  "s",
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
  "img",
];

const ALLOWED_ATTR = [
  "href",
  "src",
  "alt",
  "target",
  "rel",
  "class",
  "id",
  "style",
  "data-comment-index",
  "loading",
];

const FORBID_TAGS = ["iframe", "script"];
const FORBID_ATTR = ["onerror", "onclick", "onload", /^on.*/] as const;

/** DOMPurify 타입은 RegExp forbid 목록을 허용하지 않지만 런타임에서는 지원합니다. */
const SANITIZE_OPTIONS = {
  ALLOWED_TAGS,
  ALLOWED_ATTR,
  FORBID_TAGS,
  FORBID_ATTR: [...FORBID_ATTR],
} as Parameters<typeof DOMPurify.sanitize>[1];

interface TocSection {
  id: string;
  number: string;
  subtitle: string;
  level: number;
}

function stripForbiddenHtml(text: string): string {
  let result = text;
  result = result.replace(/<iframe[\s\S]*?>([\s\S]*?)<\/iframe>/gi, "$1");
  result = result.replace(/<iframe[\s\S]*?\/>/gi, "");
  result = result.replace(/\sonerror\s*=\s*`[\s\S]*?`/gi, "");
  result = result.replace(/\sonerror\s*=\s*"(.*?)"/gi, "");
  result = result.replace(/\sonerror\s*=\s*'(.*?)'/gi, "");
  return result;
}

/** `!||`, `!//` 등 문법 설명용 리터럴 — 포맷 적용 전에 치환했다가 끝에서 복원 */
function applyFormatting(text: string): string {
  let out = stripForbiddenHtml(text);
  const literals: string[] = [];
  const pushLiteral = (raw: string): string => {
    const id = literals.length;
    literals.push(raw);
    return `\uE000W${id}\uE001`;
  };

  out = out.replace(/!\|\|/g, () => pushLiteral("||"));
  out = out.replace(/!\/\//g, () => pushLiteral("//"));
  out = out.replace(/!__/g, () => pushLiteral("__"));
  out = out.replace(/!--/g, () => pushLiteral("--"));

  out = out.replace(/\|\|(.+?)\|\|/g, "<b>$1</b>");
  out = out.replace(/\/\/(.+?)\/\//g, "<i>$1</i>");
  out = out.replace(/__(.+?)__/g, "<u>$1</u>");
  out = out.replace(/--(.+?)--/g, "<s>$1</s>");

  /* 문서의 "틀": 멀티라인 허용, 본문 문법은 아래 단계에서 계속 처리됨 */
  out = out.replace(
    /\(\(([\s\S]+?)\)\)/g,
    '<div class="wiki-frame border border-gray-200 rounded-lg p-4 my-4 bg-gray-50 shadow-sm text-gray-800">$1</div>',
  );

  for (let i = literals.length - 1; i >= 0; i--) {
    out = out.replace(new RegExp(`\\uE000W${i}\\uE001`, "g"), literals[i]);
  }

  return out;
}

/** 위키 링크 안에서 ASCII `|` 또는 전각 `｜`으로 한 번만 분리 (한글 입력기 전각 파이프 대응) */
function splitWikiLinkTarget(linkText: string): [string] | [string, string] {
  const ascii = linkText.indexOf("|");
  const full = linkText.indexOf("｜");
  let idx = -1;
  if (ascii >= 0 && full >= 0) idx = Math.min(ascii, full);
  else idx = ascii >= 0 ? ascii : full;

  if (idx === -1) return [linkText.trim()];
  const left = linkText.slice(0, idx).trim();
  const right = linkText.slice(idx + 1).trim();
  return [left, right];
}

function looksLikeAbsoluteHttpUrl(s: string): boolean {
  const t = s.trim();
  return /^https?:\/\//i.test(t) || /^\/\//.test(t);
}

function isProbablyImageUrl(url: string): boolean {
  const pathOnly = url.trim().split("?")[0].split("#")[0];
  return /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i.test(pathOnly);
}

function externalLinkOrImg(label: string, rawHref: string): string {
  const hrefNorm = rawHref.trim().startsWith("//")
    ? `https:${rawHref.trim()}`
    : rawHref.trim();

  if (isProbablyImageUrl(hrefNorm)) {
    return `<img src="${escapeHtmlAttr(hrefNorm)}" alt="${escapeWikiLinkLabel(label)}" class="max-w-full h-auto rounded-md my-3 border border-gray-200 shadow-sm" loading="lazy" />`;
  }

  return `<a href="${escapeHtmlAttr(hrefNorm)}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${escapeWikiLinkLabel(label)}</a>`;
}

/** `<pre>` 블록은 원문 유지 (예제·코드 안의 [[ ]] 등 파손 방지) */
function splitPreservingPre(html: string): string[] {
  const re = /<pre\b[^>]*>[\s\S]*?<\/pre>/gi;
  const chunks: string[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    chunks.push(html.slice(last, m.index));
    chunks.push(m[0]);
    last = re.lastIndex;
  }
  chunks.push(html.slice(last));
  return chunks;
}

function transformOutsidePre(
  html: string,
  fn: (frag: string) => string,
): string {
  const chunks = splitPreservingPre(html);
  return chunks.map((c, i) => (i % 2 === 1 ? c : fn(c))).join("");
}

/** `![[ … ]]` 리터럴 표시 후 `[[ … ]]` 처리 */
function processWikiLinkSyntax(fragment: string): string {
  let s = fragment.replace(/!\[\[([^\]]+?)\]\]/g, (_, inner: string) => {
    return `<span class="wiki-literal text-gray-800 font-mono text-sm">[[${escapeWikiLinkLabel(inner)}]]</span>`;
  });
  s = s.replace(/\[\[([^\]]+?)\]\]/g, wikiLinkReplace);
  return s;
}

function applyMarkdownLinks(fragment: string): string {
  return fragment.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    (_, label: string, url: string) =>
      `<a href="${escapeHtmlAttr(url)}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${escapeWikiLinkLabel(label)}</a>`,
  );
}

/** 속성값용 이스케이프 (href 등) */
function escapeHtmlAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/\u0000/g, "");
}

/** 텍스트 노드용 (링크 표시글자) */
function escapeWikiLinkLabel(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function wikiLinkReplace(_: string, linkText: string): string {
  const parts = splitWikiLinkTarget(linkText);

  /* 두 조각: [[표시글|대상]] 또는 [[URL|표시글]] 둘 다 허용 */
  if (parts.length === 2) {
    const [a, b] = parts;
    if (!a && !b) return "";

    let label: string;
    let rawHref: string;

    if (looksLikeAbsoluteHttpUrl(b)) {
      label = a || b;
      rawHref = b;
    } else if (looksLikeAbsoluteHttpUrl(a)) {
      label = b || a;
      rawHref = a;
    } else {
      label = a;
      const target = b;
      const linkSlug = target.replace(/ /g, "+");
      return `<a href="/wiki/${linkSlug}" class="text-blue-500 hover:underline">${escapeWikiLinkLabel(label)}</a>`;
    }

    const hrefNorm = rawHref.trim().startsWith("//")
      ? `https:${rawHref.trim()}`
      : rawHref.trim();

    return externalLinkOrImg(label, hrefNorm);
  }

  /* 한 조각: 전체가 URL이면 외부 링크, 아니면 내부 위키 */
  const only = parts[0];
  if (!only) return "";

  if (looksLikeAbsoluteHttpUrl(only)) {
    const hrefNorm = only.trim().startsWith("//")
      ? `https:${only.trim()}`
      : only.trim();
    return externalLinkOrImg(only, hrefNorm);
  }

  const linkSlug = only.replace(/ /g, "+");
  return `<a href="/wiki/${linkSlug}" class="text-blue-500 hover:underline">${escapeWikiLinkLabel(only)}</a>`;
}

export function parseContent(text: string): {
  htmlContent: string;
  tocList: TocSection[];
  commentList: string[];
} {
  let htmlContent = applyFormatting(text);
  const tocList: TocSection[] = [];
  const commentList: string[] = [];

  const numbering = [0, 0, 0, 0];
  let currentLevel = 0;

  htmlContent = htmlContent.replace(
    /^(==+)(.*?)==+$/gm,
    (_, levelStr: string, title: string) => {
      const level = levelStr.length;

      if (level > currentLevel) {
        numbering[level - 2]++;
      } else if (level < currentLevel) {
        numbering[level - 2]++;
        numbering[level - 1] = 0;
      } else {
        numbering[level - 2]++;
      }

      for (let i = level; i < numbering.length; i++) {
        numbering[i] = 0;
      }

      currentLevel = level;
      const sectionNumber = numbering
        .slice(0, level - 1)
        .filter((num) => num > 0)
        .join(".");

      const id = `section-${tocList.length + 1}`;
      const headingRank = 6 - level;

      const subtitleWithLinks = processWikiLinkSyntax(title);

      tocList.push({
        id,
        number: sectionNumber,
        subtitle: subtitleWithLinks.trim(),
        level,
      });

      return `<h${headingRank} id="${id}" class="text-${headingRank}xl font-semibold text-gray-700 mb-4">
                        <a href="#toc_${sectionNumber}" class="text-blue-500 hover:underline" onclick="document.getElementById('toc_${sectionNumber}').scrollIntoView();">${sectionNumber}.</a> ${subtitleWithLinks}
                    </h${headingRank}><hr>`;
    },
  );

  htmlContent = transformOutsidePre(htmlContent, (frag) =>
    applyMarkdownLinks(processWikiLinkSyntax(frag)),
  );

  htmlContent = htmlContent.replace(
    /\{\{(.+?)\}\}/g,
    (_, commentText: string) => {
      const commentIndex = commentList.length + 1;
      commentList.push(commentText.trim());

      return `<sup class="comment-ref text-blue-500 hover:underline cursor-pointer relative" id="comment-ref-${commentIndex}" data-comment-index="${commentIndex}"><a href="#comment-${commentIndex}" class="text-blue-500 hover:underline cursor-pointer">[${commentIndex}]</a><span class="comment-box absolute left-1/2 transform top-6 bg-gray-800 text-white text-sm p-1 rounded-md shadow-md hidden z-10">${commentText.trim()}</span></sup>`;
    },
  );

  htmlContent = htmlContent.replace(
    /^\*\s+(.+)$/gm,
    '<li class="text-lg text-gray-600">$1</li>',
  );
  /* 나무위키식 · / ㆍ 줄머리 */
  htmlContent = htmlContent.replace(
    /^[\u318d\u00b7]\s+(.+)$/gm,
    '<li class="text-lg text-gray-600">$1</li>',
  );
  htmlContent = htmlContent.replace(
    /(?:<li\b[^>]*>[\s\S]*?<\/li>\s*)+/g,
    (block) => `<ul class="list-disc pl-6 my-2">${block.trim()}</ul>`,
  );

  htmlContent = htmlContent.replace(
    /\n/g,
    '</p><p class="text-lg text-gray-700 leading-relaxed mb-4">',
  );

  const wrappedHtml = `<p class="text-lg text-gray-700 leading-relaxed mb-4">${htmlContent}</p>`;

  const sanitizedHtml = DOMPurify.sanitize(wrappedHtml, SANITIZE_OPTIONS);

  return {
    htmlContent: sanitizedHtml,
    tocList,
    commentList,
  };
}

export const sanitizeHtml = (fragment: string) =>
  DOMPurify.sanitize(fragment, SANITIZE_OPTIONS);
