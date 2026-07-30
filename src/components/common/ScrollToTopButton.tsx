import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** 스크롤을 일정 이상 내렸을 때만 나타나는, 최상단으로 이동하는 우측 하단 버튼. */
const ScrollToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="맨 위로 이동"
      className="fixed bottom-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-full bg-[#007AEB]/10 text-[#007AEB] shadow-lg transition-colors hover:bg-[#007AEB]/20"
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.4} />
    </button>
  );
};

export default ScrollToTopButton;
