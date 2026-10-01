import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface ScrollToTopButtonProps {
  /** 지정 시 window 대신 이 요소의 스크롤을 기준으로 동작 (중첩 스크롤 컨테이너 지원). */
  targetRef?: React.RefObject<HTMLElement | null>;
}

/** 스크롤을 일정 이상 내렸을 때만 나타나는, 최상단으로 이동하는 우측 하단 버튼. */
const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ targetRef }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = targetRef?.current;
    const scrollTarget: HTMLElement | Window = el ?? window;
    const getScrollTop = () => (el ? el.scrollTop : window.scrollY);
    const onScroll = () => setVisible(getScrollTop() > 400);
    onScroll();
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollTarget.removeEventListener("scroll", onScroll);
  }, [targetRef]);

  if (!visible) return null;

  const handleClick = () => {
    const el = targetRef?.current;
    (el ?? window).scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="맨 위로 이동"
      className="fixed bottom-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-full bg-[#007AEB]/10 text-[#007AEB] shadow-lg transition-colors hover:bg-[#007AEB]/20"
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.4} />
    </button>
  );
};

export default ScrollToTopButton;
