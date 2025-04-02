import React from "react";
import { WikiEngine } from "./WikiEngine.tsx";

interface TemplateProps {
  content: string;
  className?: string;
}

export const Template: React.FC<TemplateProps> = ({
  content,
  className = "",
}) => {
  return (
    <div className={`wiki-content ${className}`}>
      <WikiEngine content={content} />
    </div>
  );
};

export default Template;
