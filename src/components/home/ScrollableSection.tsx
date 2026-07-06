"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";

interface ScrollableSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function ScrollableSection({
  title,
  children,
  className = "",
}: ScrollableSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();

    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);

    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", checkScroll);
    };
  }, [checkScroll, children]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const showButtons = canScrollLeft || canScrollRight;

  return (
    <section className={className}>
      <h2 className="text-xl font-bold text-white mb-5">{title}</h2>

      <div className="relative group/scroll">
        {/* Previous Button */}
        {showButtons && (
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`
              absolute left-0 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 rounded-full
              bg-grayDarker/90 backdrop-blur-sm
              border border-white/10
              flex items-center justify-center
              transition-all duration-300
              ${
                canScrollLeft
                  ? "opacity-0 group-hover/scroll:opacity-100 hover:bg-white/20 hover:scale-110 hover:border-white/20 cursor-pointer shadow-lg shadow-black/40"
                  : "opacity-0 pointer-events-none"
              }
            `}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {children}
        </div>

        {/* Next Button */}
        {showButtons && (
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`
              absolute right-0 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 rounded-full
              bg-grayDarker/90 backdrop-blur-sm
              border border-white/10
              flex items-center justify-center
              transition-all duration-300
              ${
                canScrollRight
                  ? "opacity-0 group-hover/scroll:opacity-100 hover:bg-white/20 hover:scale-110 hover:border-white/20 cursor-pointer shadow-lg shadow-black/40"
                  : "opacity-0 pointer-events-none"
              }
            `}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Edge fade gradients */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-grayDarkest to-transparent pointer-events-none z-[5]" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-grayDarkest to-transparent pointer-events-none z-[5]" />
        )}
      </div>
    </section>
  );
}
