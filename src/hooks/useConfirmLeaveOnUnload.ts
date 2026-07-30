import { useEffect } from "react";

/** 새로고침/탭 닫기 등 브라우저 레벨 이탈 시 저장되지 않은 내용에 대한 경고를 띄운다. */
export function useConfirmLeaveOnUnload(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [enabled]);
}
