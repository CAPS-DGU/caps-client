import { User } from "./common";
import { WikiData } from "./pages";

export interface TemplateProps {
  data: {
    writer: User;
    title: string;
    content: string;
  } | null;
  notFoundFlag?: boolean;
  history?: any;
  prevData?: {
    content: string;
  };
}

export interface WikiEngineProps {
  author: User;
  DocTitle: string;
  content: string;
  notFoundFlag?: boolean;
  history?: any;
  prevContent?: string;
  className?: string;
}
