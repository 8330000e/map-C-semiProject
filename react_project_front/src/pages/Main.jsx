// 서비스 메인 화면 컴포넌트입니다.
// 실시간 댓글, 메뉴, 중고거래 요약 리스트 등 메인 대시보드 UI를 렌더링합니다.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import HelpIcon from "@mui/icons-material/Help";
import useAuthStore from "../store/useAuthStore";
import Map from "../components/mainpage/Map";
import Bestpostlist from "../components/mainpage/Bestpostlist";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import Swal from "sweetalert2";

const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";

const getSaleStatusLabel = (productStatus) => {
  if (
    productStatus === "예약중" ||
    productStatus === 1 ||
    productStatus === "1"
  )
    return "예약중";
  if (
    productStatus === "판매완료" ||
    productStatus === 2 ||
    productStatus === "2"
  )
    return "판매완료";
  return "판매중";
};

const getImageUrl = (thumb) => {
  // thumb가 서버에서 여러 모양으로 들어올 수 있어요.
  // 그래서 여기서 브라우저가 바로 쓸 수 있는 주소로 정리해줍니다.
  if (!thumb) return null;
  if (typeof thumb !== "string") return null;
  let trimmed = thumb.trim();
  if (!trimmed) return null;

  trimmed = trimmed.replace(/\\\\/g, "/").replace(/\\/g, "/");

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
    return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;

  const driveMatch = trimmed.match(/^[A-Za-z]:\//);
  if (driveMatch) {
    const boardIndex = trimmed.indexOf("/board/editor/");
    if (boardIndex !== -1) {
      const suffix = trimmed.substring(boardIndex);
      return `${BACKSERVER}${suffix.startsWith("/") ? "" : "/"}${suffix}`;
    }
    trimmed = trimmed.substring(trimmed.indexOf("/") + 1);
  }

  if (trimmed.startsWith("/")) return `${BACKSERVER}${trimmed}`;
  if (trimmed.includes("/upload/"))
    return `${BACKSERVER}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  if (trimmed.includes("/board/editor/"))
    return `${BACKSERVER}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  if (trimmed.match(/^.+\.(jpg|jpeg|png|gif|bmp)$/i))
    return `${BACKSERVER}/board/editor/${trimmed.replace(/^\//, "")}`;
  if (trimmed.includes("/board/editor/"))
    return `${BACKSERVER}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  return `${BACKSERVER}/board/editor/${trimmed}`;
};

const Main = () => {
  // 중고거래 리스트 가로 스크롤 영역 DOM에 접근하기 위한 ref
  const usedListRef = useRef(null);
  // 실시간 댓글 "보여지는 영역" DOM
  const realtimeViewportRef = useRef(null);
  // 실시간 댓글 "실제 텍스트" DOM
  const realtimeTextRef = useRef(null);
  // 중고거래 API 데이터
  const [goods, setGoods] = useState([]);

  const navigate = useNavigate();
  const { memberId } = useAuthStore();
  const isLogin = !!memberId;

  //랜덤 미션 패널
  const [todayRandomMission, setTodayRandomMission] = useState(null);
  const [showMissionBubble, setShowMissionBubble] = useState(false);
  const [randomMissionCompleted, setRandomMissionCompleted] = useState(false);

  useEffect(() => {
    axios
      .get(`${BACKSERVER}/api/store/boards`)
      .then((res) => {
        const items = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.items)
            ? res.data.items
            : [];
        setGoods(items);
      })
      .catch((err) => console.error("중고장터 목록 조회 실패", err));
  }, []);

  // 중고거래 리스트(조회수 기준 상위 10개, 판매중인 항목만)
  const usedGoods = useMemo(() => {
    return goods
      .filter((item) => getSaleStatusLabel(item.productStatus) === "판매중")
      .sort((a, b) => (b.readCount || 0) - (a.readCount || 0))
      .slice(0, 10);
  }, [goods]);

  // 실시간 댓글 - 최신 리뷰 30개를 API에서 가져옴
  const [realtimeComments, setRealtimeComments] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKSERVER}/api/store/reviews/latest?limit=30`)
      .then((res) =>
        setRealtimeComments(Array.isArray(res.data) ? res.data : []),
      )
      .catch((err) => console.error("실시간 댓글 조회 실패", err));
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
  // 댓글 목록이 로드되면 20초마다 순서대로 교체
  useEffect(() => {
    if (!realtimeComments.length) return;
    let idx = 0;
    setVisibleRealtimeComment(realtimeComments[0]);
    const timer = setInterval(() => {
      idx = (idx + 1) % realtimeComments.length;
      setVisibleRealtimeComment(realtimeComments[idx]);
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

  //랜덤 미션 패널
  useEffect(() => {
    if (!isLogin) return;

    let timer;

    const fetchRandomMissionBubble = async () => {
      try {
        // 1. 오늘의 랜덤 미션 조회
        const missionRes = await axios.get(`${BACKSERVER}/missions/random`, {
          params: { memberId },
        });

        if (!missionRes.data) return;

        const mission = missionRes.data;
        setTodayRandomMission(mission);

        // 2. 오늘 랜덤 미션 완료 여부 조회
        const completedRes = await axios.get(
          `${BACKSERVER}/missions/random/today/completed`,
          {
            params: {
              memberId,
              missionNo: mission.missionNo,
            },
          },
        );

        const completed = completedRes.data.completed === true;
        setRandomMissionCompleted(completed);

        // 3. 이미 완료했으면 안 띄움
        if (completed) {
          setShowMissionBubble(false);
          return;
        }

        // 4. 오늘 이미 한 번 띄운 적 있으면 안 띄움
        const today = new Date().toISOString().slice(0, 10);
        const missionPopupKey = `randomMissionPopup_${memberId}_${today}`;

        if (localStorage.getItem(missionPopupKey) === "shown") {
          setShowMissionBubble(false);
          return;
        }

        // 5. 처음 보는 경우만 5초간 노출
        setShowMissionBubble(true);
        localStorage.setItem(missionPopupKey, "shown");

        timer = setTimeout(() => {
          setShowMissionBubble(false);
        }, 3500);
      } catch (err) {
        console.error("오늘의 랜덤 미션 패널 처리 실패", err);
      }
    };

    fetchRandomMissionBubble();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLogin, memberId]);

  //미션버튼 클릭-> 로그인으로 이동
  const handleMissionClick = async () => {
    if (!isLogin) {
      const result = await Swal.fire({
        icon: "warning",
        title: "로그인이 필요합니다",
        text: "미션(출석체크)은 로그인 후 이용할 수 있습니다. 로그인 페이지로 이동하시겠습니까?",
        showCancelButton: true,
        confirmButtonText: "로그인",
        cancelButtonText: "취소",
        confirmButtonColor: "#464d3e",
        cancelButtonColor: "#b0b0b0",
      });

      if (result.isConfirmed) {
        navigate("/members/login", { state: { from: "/mission" } });
      }
      return;
    }

    navigate("/mission");
  };

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
              <Link
                to="/mission"
                onClick={(e) => {
                  if (!isLogin) {
                    e.preventDefault(); // 이동 막기
                    handleMissionClick();
                  }
                }}
              >
                미션(출석체크)
              </Link>
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
            <button className="btn" onClick={() => navigate("/support")}>
              문의하기 ▶
            </button>
          </div>
        </div>

        <div className="main_map roundBorder">
          {/* <p>Map</p> */}
          {/*위치설명*/}
          <Map />
        </div>

        <div className="main_content_one">
          <div className="best_list roundBorder">
            {/* <p>인기게시글</p> */}
            {/*위치설명*/}
            <Bestpostlist className="bestpostlist" />
          </div>
          <div className="tip_list roundBorder">
            <p>팁 리스트</p>
            {/*위치설명*/}
          </div>
        </div>

        <div className="main_content_two">
          <div
            className="campaign_zone roundBorder"
            onClick={() => {
              console.log("클릭버튼");
              navigate("/campaign/main");
            }}
          >
            <p>캠페인 존</p>
            {/*캠페인 컴포넌트 호출 */}
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
                  ? `${visibleRealtimeComment.memberNickname || visibleRealtimeComment.memberId} : ${visibleRealtimeComment.reviewContent}`
                  : "실시간 댓글이 없습니다."}
              </p>
            </div>
          </div>

          <div className="rank_list roundBorder">
            <p>랭킹 리스트</p>
            {/*위치설명*/}
          </div>
        </div>
        {/*랜덤 미션*/}
        {showMissionBubble && todayRandomMission && !randomMissionCompleted && (
          <div className="floating_mission_box" onClick={handleMissionClick}>
            <div className="floating_mission_icon">
              <ConfirmationNumberIcon />
            </div>
            <span>랜덤 미션</span>
          </div>
        )}
      </div>

      <div className="main_btm">
        <div className="used_list roundBorder">
          <div className="used_list_scroll" ref={usedListRef}>
            <ul>
              {usedGoods.map((item, index) => {
                const imageUrl = getImageUrl(item.productThumb);
                return (
                  <li key={item.marketNo ?? item.boardNo ?? index}>
                    <Link to={`/store/${item.marketNo}`}>
                      <div className="used_item_image" aria-hidden="true">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.marketTitle || "상품 이미지"}
                          />
                        ) : null}
                      </div>
                      <div className="used_item_info">
                        <strong>
                          [{getSaleStatusLabel(item.productStatus)}]{" "}
                          {item.marketTitle}
                        </strong>
                        <p className="used_item_price">
                          {item.productPrice
                            ? `${Number(item.productPrice).toLocaleString("ko-KR")}원`
                            : ""}
                        </p>
                        <div className="used_item_meta">
                          <span>{item.memberNickname || item.memberId}</span>
                          <span>|</span>
                          <span>💬 {item.commentCount ?? 0}</span>
                          <span>|</span>
                          <span>
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString(
                                  "ko-KR",
                                )
                              : ""}
                          </span>
                        </div>
                        <span className="used_item_view">
                          👀{" "}
                          {Number(item.readCount ?? 0).toLocaleString("ko-KR")}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;
