import { WikiComment, WikiSection } from "../types/wiki";

export const wikiUtils = {
  applyFormatting: (text: string): string => {
    let formattedText = text
      .replace(/\|\|(.+?)\|\|/g, "<b>$1</b>")
      .replace(/\/\/(.+?)\/\//g, "<i>$1</i>")
      .replace(/__(.+?)__/g, "<u>$1</u>")
      .replace(/--(.+?)--/g, "<s>$1</s>")
      .replace(/\(\((.+?)\)\)/g, "<pre>$1</pre>");
    return formattedText;
  },

  parseContent: (text: string) => {
    let htmlContent = wikiUtils.applyFormatting(text);
    let sections: WikiSection[] = [];
    let comments: WikiComment[] = [];
    let commentIndex = 1;

    // Parse sections
    htmlContent = htmlContent.replace(
      /^(==+)(.*?)==+$/gm,
      (_, levelStr, title) => {
        const level = levelStr.length;
        const id = `section-${sections.length + 1}`;
        sections.push({ id, title: title.trim(), level });
        return `<h${level} id="${id}" class="text-${
          level + 1
        }xl font-bold mt-4 mb-2">${title.trim()}</h${level}>`;
      }
    );

    // Parse links
    htmlContent = htmlContent.replace(/\[\[([^\]]+?)\]\]/g, (_, linkText) => {
      const [text] = linkText.split("|");
      const link_text = text ? text.replace(/ /g, "+") : null;
      return text
        ? `<a href="/wiki/${link_text}" class="text-blue-500 hover:underline">${text}</a>`
        : "";
    });

    // Parse comments
    htmlContent = htmlContent.replace(/\{\{(.+?)\}\}/g, (_, commentText) => {
      const commentId = `comment-${commentIndex}`;
      const refId = `comment-ref-${commentIndex}`;
      comments.push({
        id: commentIndex,
        text: commentText.trim(),
        refId,
      });
      commentIndex++;
      return `<sup class="comment-ref text-blue-500 hover:underline cursor-pointer relative" id="${refId}">
        <a href="#${commentId}" class="text-blue-500 hover:underline cursor-pointer">[${
        commentIndex - 1
      }]</a>
        <span class="comment-box absolute left-1/2 transform top-6 bg-gray-800 text-white text-sm p-1 rounded-md shadow-md hidden z-10">
          ${commentText.trim()}
        </span>
      </sup>`;
    });

    // Parse lists
    htmlContent = htmlContent
      .replace(/^\* (.+)$/gm, '<li class="text-lg text-gray-600">$1</li>')
      .replace(
        /(<li>.*<\/li>)(?!.*<\/ul>)/g,
        '<ul class="list-disc pl-6">$1</ul>'
      );

    // Parse paragraphs
    htmlContent = htmlContent.replace(
      /\n/g,
      '</p><p class="text-lg text-gray-700 leading-relaxed mb-4">'
    );

    return {
      htmlContent: `<p class="text-lg text-gray-700 leading-relaxed mb-4">${htmlContent}</p>`,
      sections,
      comments,
    };
  },

  escapeScriptTags: (str: string): string => {
    return str.replace(/(<script\b[^>]*>|<\/script>)/gi, (match) => {
      return match.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    });
  },
};
