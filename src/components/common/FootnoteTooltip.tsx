import React, {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface Props {
  href: string;
  label: string;
  children: React.ReactNode;
}

/** Touch opens on the first tap and follows the anchor on the second tap. */
export default function FootnoteTooltip({ href, label, children }: Props) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLSpanElement>(null);
  const touch = useRef(false);
  const tooltipId = useId();
  const [position, setPosition] = useState({ left: 0, top: 0, width: 240 });

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const rect = root.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(240, window.innerWidth - 16);
      setPosition({
        left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
        top: rect.bottom + 6,
        width,
      });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  return (
    <span
      ref={root}
      className="relative inline-block leading-normal"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        touch.current = false;
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <a
        href={href}
        aria-label={label}
        aria-describedby={open ? tooltipId : undefined}
        className="text-blue-500 hover:underline"
        onPointerDown={(event) => {
          touch.current =
            event.pointerType === "touch" || event.pointerType === "pen";
        }}
        onFocus={() => {
          if (!touch.current) setOpen(true);
        }}
        onClick={(event) => {
          if (touch.current && !open) {
            event.preventDefault();
            setOpen(true);
          } else {
            setOpen(false);
          }
        }}
      >
        {label}
      </a>
      {open &&
        createPortal(
          <span
            id={tooltipId}
            role="tooltip"
            style={position}
            className="fixed pointer-events-none z-40 block rounded-md bg-gray-800 p-3 text-sm font-normal text-white shadow-lg break-words"
          >
            {children}
          </span>,
          document.body,
        )}
    </span>
  );
}
