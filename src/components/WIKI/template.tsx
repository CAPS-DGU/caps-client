import React from "react";
import WikiContent from "./WikiEngine";
import { User } from "../../types/common";
import { WikiData } from "../../types/pages";

interface TemplateProps {
  data: (WikiData & { writer?: User }) | null;
  notFoundFlag?: boolean;
  history?: any;
  prevData?: {
    content: string;
  };
}

const Template: React.FC<TemplateProps> = ({
  data,
  notFoundFlag,
  history,
  prevData,
}) => {
  if (!data) return null;

  return (
    <div className="m-4 wiki-page">
      <WikiContent
        author={data.writer}
        DocTitle={data.title}
        content={data.content}
        notFoundFlag={notFoundFlag}
        history={history}
        prevContent={prevData?.content}
      />
    </div>
  );
};

export default Template;
