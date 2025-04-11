import React from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import { useWiki } from "../../hooks/useWiki";
import Template from "./template.tsx";
import { WikiData as PagesWikiData } from "../../types/pages";
import { WikiData as WikiWikiData } from "../../types/wiki";
import { User } from "../../types/common";

interface WikiContentProps {
  data?: PagesWikiData;
}

export const WikiContent: React.FC<WikiContentProps> = ({ data }) => {
  const { wiki_title } = useParams<{ wiki_title: string }>();
  const { wikiData, loading } = useWiki(wiki_title);

  if (loading && !data) {
    return (
      <div className="flex justify-center p-4">
        <Spin />
      </div>
    );
  }

  const content = data || wikiData;
  if (!content || !content.content) {
    return <div>문서를 찾을 수 없습니다.</div>;
  }

  const templateData: PagesWikiData = {
    title: content.title,
    content: content.content,
    writer: content.writer
      ? ({ id: content.writer, name: content.writer } as User)
      : undefined,
  };

  return <Template data={templateData} />;
};

export default WikiContent;
