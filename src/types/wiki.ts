export interface WikiData {
  title: string;
  content: string;
  writer?: string;
  time?: string;
}

export interface WikiHistoryData extends WikiData {
  version: string;
  description: string;
  previousVersion?: string;
}

export interface WikiSearchParams {
  keyword: string;
  page: number;
  pageSize: number;
}

export interface WikiFormData {
  title: string;
  content: string;
  description?: string;
}

export interface WikiComment {
  id: string;
  refId: string;
  text: string;
}

export interface WikiSection {
  id: string;
  title: string;
  level: number;
  content: string;
}
