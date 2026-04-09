import { useEffect, useRef, useState } from "react";

// 가로 스크롤 리스트를 재사용하기 위한 컴포넌트임.
// 주로 가로로 길게 이어지는 카드 목록을 감쌀 때 사용함.
// 사용 예시:
// <HorizontalScrollList scrollClassName="used_list_scroll">
//   <ul>...</ul>
// </HorizontalScrollList>
const HorizontalScrollList = ({
  children,
  wrapperClassName = "",
  scrollClassName = "",
  showButtons = true,
  stepRatio = 0.7,
}) => {
  const scrollRef = useRef(null);
  const [hasScroll, setHasScroll] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setHasScroll(el.scrollWidth > el.clientWidth + 1);
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scrollByDirection = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = el.clientWidth * stepRatio;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();
    const handleResize = () => updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", handleResize);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", handleResize);
    };
  }, [children]);

  return (
    <div className={`horizontal_scroll_wrap ${wrapperClassName}`.trim()}>
      {showButtons && hasScroll && (
        <button
          type="button"
          className="horizontal_scroll_btn horizontal_scroll_left"
          onClick={() => scrollByDirection(-1)}
          disabled={!canScrollLeft}
        >
          ◀
        </button>
      )}
      <div ref={scrollRef} className={`horizontal_scroll_area ${scrollClassName}`.trim()}>
        {children}
      </div>
      {showButtons && hasScroll && (
        <button
          type="button"
          className="horizontal_scroll_btn horizontal_scroll_right"
          onClick={() => scrollByDirection(1)}
          disabled={!canScrollRight}
        >
          ▶
        </button>
      )}
    </div>
  );
};

export default HorizontalScrollList;
