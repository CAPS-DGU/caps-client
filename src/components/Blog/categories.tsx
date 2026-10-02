import { Calendar, BookOpen, Code2, type LucideIcon } from "lucide-react";

/**
 * 블로그 카테고리 메타 (라벨·아이콘) 정본.
 * 목록 필터 / 카드 배지 / 상세 배지 / 작성폼 선택칩이 모두 이 정의를 공유한다.
 * 백엔드 enum(GetBlogsCategory·BlogListResponseCategory·CreateOrModifyBlogRequestCategory)은
 * 값이 모두 EVENTS/ACADEMIC/TECH 로 동일하므로 문자열 키로 좁혀 쓴다.
 */
export type BlogCategoryKey = "EVENTS" | "ACADEMIC" | "TECH";

export interface BlogCategoryMeta {
  key: BlogCategoryKey;
  /** 배지·필터에 노출하는 영문 라벨 (디자인 기준) */
  label: string;
  /** 한글 라벨 */
  korean: string;
  /** 작성폼 선택칩의 보조 설명 */
  hint: string;
  Icon: LucideIcon;
}

export const BLOG_CATEGORIES: BlogCategoryMeta[] = [
  { key: "EVENTS", label: "Events", korean: "행사", hint: "행사 기록", Icon: Calendar },
  { key: "ACADEMIC", label: "Academic", korean: "학술", hint: "학술 아카이빙", Icon: BookOpen },
  { key: "TECH", label: "Tech", korean: "기술", hint: "기술 인사이트", Icon: Code2 },
];

export const BLOG_CATEGORY_MAP: Record<string, BlogCategoryMeta> = Object.fromEntries(
  BLOG_CATEGORIES.map((c) => [c.key, c])
);

/** 카테고리 키를 디자인 라벨(영문)로. 알 수 없는 값은 그대로 돌려준다. */
export function blogCategoryLabel(key?: string): string {
  return (key && BLOG_CATEGORY_MAP[key]?.label) || key || "";
}
