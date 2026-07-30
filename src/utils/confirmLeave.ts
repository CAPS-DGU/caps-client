export const UNSAVED_LEAVE_MESSAGE =
  "작성하신 내용은 저장되지 않습니다.\n이 페이지를 떠나시겠습니까?";

/** 작성/수정 중인 페이지를 벗어나기 전 확인한다. */
export function confirmLeave(): boolean {
  return window.confirm(UNSAVED_LEAVE_MESSAGE);
}
