import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const LIST_PATHS = ["/blog", "/ledger"] as const;

function isListPath(path: string): path is (typeof LIST_PATHS)[number] {
  return (LIST_PATHS as readonly string[]).includes(path);
}

/** 목록의 상세·작성·수정 등 하위 경로인지 (예: /blog/1, /ledger/edit) */
function isListChild(listPath: string, path: string): boolean {
  return path.startsWith(`${listPath}/`);
}

function readScrollY(): number {
  return window.scrollY || document.documentElement.scrollTop || 0;
}

function writeScrollY(y: number) {
  window.scrollTo(0, y);
  document.documentElement.scrollTop = y;
  document.body.scrollTop = y;
}

/**
 * 기본: 경로가 바뀌면 스크롤을 최상단으로.
 * 예외: 블로그/장부 상세·작성에서 해당 목록으로 돌아올 때는 이전 스크롤 위치를 복원한다.
 *
 * 목록 unmount 이후에는 scrollY 가 이미 0일 수 있어,
 * 목록에 머무는 동안 scroll 이벤트로 위치를 계속 기록한다.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const prevPathRef = useRef(pathname);
  const listScrollRef = useRef<Partial<Record<(typeof LIST_PATHS)[number], number>>>({});
  const pendingRestoreYRef = useRef<number | null>(null);

  // 경로 변경 직후: 복원 목표를 먼저 확정 (다른 effect 가 메모리를 덮어쓰기 전에)
  useLayoutEffect(() => {
    const prev = prevPathRef.current;

    const returningToList =
      isListPath(pathname) && prev !== pathname && isListChild(pathname, prev);

    if (returningToList) {
      pendingRestoreYRef.current = listScrollRef.current[pathname] ?? 0;
    } else {
      pendingRestoreYRef.current = null;
      writeScrollY(0);
    }

    prevPathRef.current = pathname;
  }, [pathname]);

  // 목록으로 복귀 시 컨텐츠 높이 확보될 때까지 스크롤 재적용
  useEffect(() => {
    const y = pendingRestoreYRef.current;
    if (y == null || y <= 0) return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 40;

    const tryRestore = () => {
      if (cancelled) return;
      writeScrollY(y);
      attempts += 1;
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      if (maxScroll >= y - 8 || attempts >= maxAttempts) {
        pendingRestoreYRef.current = null;
        return;
      }
      window.setTimeout(tryRestore, 50);
    };

    const frame = window.requestAnimationFrame(tryRestore);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  // 목록에 있는 동안 스크롤만 기록 (마운트 직후 save 금지 — 복원 값을 0으로 덮어씀)
  useEffect(() => {
    if (!isListPath(pathname)) return;

    const save = () => {
      // 복원 재시도 중에는 덮어쓰지 않음
      if (pendingRestoreYRef.current != null) return;
      listScrollRef.current[pathname] = readScrollY();
    };

    window.addEventListener("scroll", save, { passive: true });
    return () => {
      window.removeEventListener("scroll", save);
    };
  }, [pathname]);

  return null;
};

export default ScrollToTop;
