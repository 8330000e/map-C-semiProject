// 서비스 메인 화면 컴포넌트입니다.
// 실시간 댓글, 메뉴, 중고거래 요약 리스트 등 메인 대시보드 UI를 렌더링합니다.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import HelpIcon from "@mui/icons-material/Help";
import { dummyData, storeDummyData } from "../components/mock/dummyData";
import useAuthStore from "../store/useAuthStore";
import Map from "../components/map/Map";

const STORE_STATUS_KEY = "storeSaleStatusMap";

const getSaleStatusMap = () => {
  try {
    const raw = localStorage.getItem(STORE_STATUS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const getSaleStatusById = (id, map) => map[id] || "판매중";

const Main = () => {
  // 중고거래 리스트 가로 스크롤 영역 DOM에 접근하기 위한 ref
  const usedListRef = useRef(null);
  // 실시간 댓글 "보여지는 영역" DOM
  const realtimeViewportRef = useRef(null);
  // 실시간 댓글 "실제 텍스트" DOM
  const realtimeTextRef = useRef(null);
  const [saleStatusMap, setSaleStatusMap] = useState(() => getSaleStatusMap());

  useEffect(() => {
    const syncSaleStatus = () => setSaleStatusMap(getSaleStatusMap());
    window.addEventListener("storage", syncSaleStatus);
    window.addEventListener("store-status-updated", syncSaleStatus);

    return () => {
      window.removeEventListener("storage", syncSaleStatus);
      window.removeEventListener("store-status-updated", syncSaleStatus);
    };
  }, []);

  // 중고거래 리스트(조회수 기준 상위 10개)
  // useMemo: 렌더링마다 정렬/슬라이스를 반복하지 않도록 결과를 메모이징
  const usedGoods = useMemo(() => {
    return [...storeDummyData]
      .map((item) => ({
        ...item,
        saleStatus: getSaleStatusById(item.id, saleStatusMap),
      }))
      .filter((item) => item.saleStatus === "판매중")
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 10);
  }, [saleStatusMap]);

  // 게시글의 댓글들을 "실시간 댓글용" 형태로 평탄화
  // 예) { user, text, region } 형태로 변환
  const realtimeComments = useMemo(() => {
    return dummyData.flatMap((post) =>
      (post.comments || []).map((comment) => ({
        id: comment.id,
        user: comment.user,
        text: comment.text,
        region: post.locationName,
      })),
    );
  }, []);

  // 화면에 현재 보여줄 댓글 1개
  // 초기값은 댓글 목록에서 랜덤으로 선택
  const [visibleRealtimeComment, setVisibleRealtimeComment] = useState(() => {
    if (!realtimeComments.length) return null;
    return realtimeComments[
      Math.floor(Math.random() * realtimeComments.length)
    ];
  });

  // 텍스트를 왼쪽으로 이동시키기 위한 x축 값(px)
  const [realtimeOffset, setRealtimeOffset] = useState(0);
  // 이동 애니메이션 문자열 (예: transform 5s linear)
  const [realtimeTransition, setRealtimeTransition] = useState("none");

  // 20초마다 댓글 1개를 랜덤으로 교체
  useEffect(() => {
    if (!realtimeComments.length) return;

    setVisibleRealtimeComment(
      realtimeComments[Math.floor(Math.random() * realtimeComments.length)],
    );

    const timer = setInterval(() => {
      setVisibleRealtimeComment(
        realtimeComments[Math.floor(Math.random() * realtimeComments.length)],
      );
    }, 20000);

    return () => clearInterval(timer);
  }, [realtimeComments]);

  // 댓글이 바뀔 때마다 "한 줄 자동 스크롤" 애니메이션 재설정
  useEffect(() => {
    if (!visibleRealtimeComment) return;
    if (!realtimeViewportRef.current || !realtimeTextRef.current) return;

    // 보여지는 박스 너비 / 실제 텍스트 너비
    const viewportWidth = realtimeViewportRef.current.clientWidth;
    const textWidth = realtimeTextRef.current.scrollWidth;
    // 텍스트가 얼마나 넘치는지 계산
    const overflowWidth = textWidth - viewportWidth;

    // 시작 상태: 왼쪽 처음 위치, 애니메이션 없음
    setRealtimeTransition("none");
    setRealtimeOffset(0);

    // 넘치지 않으면 이동할 필요 없음
    if (overflowWidth <= 0) return;

    // 넘친 길이에 따라 이동 속도를 자동 계산
    // 너무 느리거나 빠르지 않게 최소/최대 시간 제한
    const moveDuration = Math.min(Math.max(overflowWidth / 35, 4), 14);
    const moveDelay = 200;
    const holdDuration = 3000;
    const resetDuration = 500;
    const restartDelay = 200;
    const timers = [];

    // 1사이클: 이동 -> 끝에서 잠깐 대기 -> 처음으로 복귀 -> 다시 반복
    const startCycle = () => {
      // (1) 텍스트를 왼쪽으로 이동
      const moveTimer = setTimeout(() => {
        setRealtimeTransition(`transform ${moveDuration}s linear`);
        setRealtimeOffset(-overflowWidth);
      }, moveDelay);
      timers.push(moveTimer);

      // (2) 끝까지 이동 후 3초 대기한 뒤 처음 위치로 복귀
      const resetTimer = setTimeout(
        () => {
          setRealtimeTransition(`transform ${resetDuration / 1000}s ease`);
          setRealtimeOffset(0);
        },
        moveDelay + moveDuration * 1000 + holdDuration,
      );
      timers.push(resetTimer);

      // (3) 복귀 후 약간 쉬고 다시 같은 사이클 반복
      const nextCycleTimer = setTimeout(
        () => {
          setRealtimeTransition("none");
          startCycle();
        },
        moveDelay +
          moveDuration * 1000 +
          holdDuration +
          resetDuration +
          restartDelay,
      );
      timers.push(nextCycleTimer);
    };

    startCycle();

    return () => {
      // 댓글 변경/언마운트 시 기존 타이머 정리(메모리 누수 방지)
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [visibleRealtimeComment]);

  return (
    <main className="main_wrap">
      <div className="main_top">
        <div className="main_nav">
          <div className="menu_bar">
            <span>메뉴</span>
          </div>
          <ul>
            <li>
              <Link to="map-community">맵 커뮤니티</Link>
            </li>
            <li>
              <a href="#">회원끼리 캠페인</a>
            </li>
            <li>
              <Link to="/store">중고거래</Link>
            </li>
            <li>
              <Link to="/mission">미션(출석체크)</Link>
            </li>
            <li>
              <Link to="/tree-grow" className="treeGrow">
                나무 키우기
              </Link>
            </li>
            <li>
              <span>
                <hr />
              </span>
            </li>
            <li>
              <a href="#">공지사항</a>
            </li>
          </ul>
          <div className="main_quest_wrap">
            <span>
              <p>고객센터</p>
              <p>
                <HelpIcon />
              </p>
            </span>
            <p>고객센터 운영시간</p>
            <p>10:00 ~ 18:00</p>
            <button className="btn">문의하기 ▶</button>
          </div>
        </div>

        <div className="main_map roundBorder">
          {/* <p>Map</p> */}
          {/*위치설명*/}
          <Map />
        </div>

        <div className="main_content_one">
          <div className="best_list roundBorder">
            <p>인기게시글</p>
            {/*위치설명*/}
          </div>
          <div className="tip_list roundBorder">
            <p>팁 리스트</p>
            {/*위치설명*/}
          </div>
        </div>

        <div className="main_content_two">
          <div className="campaign_zone roundBorder">
            <p>캠페인 존</p>
            {/*위치설명*/}
          </div>

          <div className="realtime_comment roundBorder">
            <div
              className="realtime_comment_viewport"
              ref={realtimeViewportRef}
            >
              <p
                className="realtime_comment_line"
                ref={realtimeTextRef}
                style={{
                  transform: `translateX(${realtimeOffset}px)`,
                  transition: realtimeTransition,
                }}
              >
                {visibleRealtimeComment
                  ? `${visibleRealtimeComment.user} : ${visibleRealtimeComment.text} ${visibleRealtimeComment.region}`
                  : "실시간 댓글이 없습니다."}
              </p>
            </div>
          </div>

          <div className="rank_list roundBorder">
            <p>랭킹 리스트</p>
            {/*위치설명*/}
          </div>
        </div>
      </div>

      <div className="main_btm">
        <div className="used_list roundBorder">
          <div className="used_list_scroll" ref={usedListRef}>
            <ul>
              {usedGoods.map((item) => (
                <li key={item.id}>
                  <Link to={`/store/${item.id}`}>
                    <div className="used_item_image" aria-hidden="true" />
                    <div className="used_item_info">
                      <strong>
                        [{item.saleStatus}] {item.title}
                      </strong>
                      <p className="used_item_price">{item.price}</p>
                      <div className="used_item_meta">
                        <span>{item.author}</span>
                        <span>|</span>
                        <span>💬 {item.comments || 0}</span>
                        <span>|</span>
                        <span>{item.date}</span>
                      </div>
                      <span className="used_item_view">
                        👀 {item.viewCount || 0}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;
