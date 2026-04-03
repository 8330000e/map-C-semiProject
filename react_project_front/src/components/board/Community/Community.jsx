import { useEffect, useState } from "react";
import styles from "./Community.module.css";
import axios from "axios";
import TextEditor from "./TextEditor";
import useAuthStore from "../../../store/useAuthStore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatIcon from "@mui/icons-material/Chat";

const Community = () => {
  const { memberId } = useAuthStore();
  const isLogin = !!memberId;

  const [mode, setMode] = useState("list");
  const [boardList, setBoardList] = useState([]);

  const [type, setType] = useState(1);
  const [keyword, setKeyword] = useState("");

  const [searchType, setSearchType] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards`, {
        params: {
          status: 1,
          searchType,
          searchKeyword,
          sido,
          sigungu,
        },
      })
      .then((res) => {
        setBoardList(res.data.items || []);
      })
      .catch((err) => {
        console.log(err);

        setBoardList([
          {
            boardNo: 1,
            boardTitle: "오늘 플로깅 하면서 본 풍경 공유합니다",
            writerNickname: "유저 닉네임",
            createDate: "작성일",
            thumbnailUrl: "",
            likeCount: 20,
            commentCount: 6,
          },
          {
            boardNo: 2,
            boardTitle: "탄소 절감 챌린지 참여 후기",
            writerNickname: "유저 닉네임",
            createDate: "작성일",
            thumbnailUrl: "",
            likeCount: 20,
            commentCount: 5,
          },
          {
            boardNo: 3,
            boardTitle: "분리배출 꿀팁 모음",
            writerNickname: "유저 닉네임",
            createDate: "작성일",
            thumbnailUrl: "",
            likeCount: 20,
            commentCount: 2,
          },
          {
            boardNo: 4,
            boardTitle: "우리 동네 친환경 매장 추천",
            writerNickname: "유저 닉네임",
            createDate: "작성일",
            thumbnailUrl: "sample",
            likeCount: 20,
            commentCount: 5,
          },
          {
            boardNo: 5,
            boardTitle: "출석 체크 이벤트 같이 해요",
            writerNickname: "유저 닉네임",
            createDate: "작성일",
            thumbnailUrl: "",
            likeCount: 20,
            commentCount: 10,
          },
          {
            boardNo: 6,
            boardTitle: "탄소중립 실천 인증합니다",
            writerNickname: "유저 닉네임",
            createDate: "작성일",
            thumbnailUrl: "",
            likeCount: 11,
            commentCount: 4,
          },
        ]);
      });
  }, [searchType, searchKeyword, sido, sigungu]);

  const submitSearch = (e) => {
    e.preventDefault();
    setSearchType(type);
    setSearchKeyword(keyword);
  };

  const submitWrite = () => {
    console.log({
      title,
      content,
      sido,
      sigungu,
    });

    alert("작성 완료 처리 위치입니다. 나중에 API 연결하면 됩니다.");
    setMode("list");
  };

  return (
    <section className={styles.mapCommunityWrap}>
      <div className={styles.mapCommunityInner}>
        <div className={styles.mapCommunityRight}>
          {mode === "list" ? (
            <>
              <div className={styles.mapCommunityFilterRow}>
                <select
                  className={styles.mapCommunitySelect}
                  value={sido}
                  onChange={(e) => {
                    setSido(e.target.value);
                    setSigungu("");
                  }}
                >
                  <option value="">시/도 선택</option>
                  <option value="서울">서울특별시</option>
                  <option value="경기">경기도</option>
                  <option value="인천">인천광역시</option>
                  <option value="부산">부산광역시</option>
                </select>

                <select
                  className={styles.mapCommunitySelect}
                  value={sigungu}
                  onChange={(e) => {
                    setSigungu(e.target.value);
                  }}
                >
                  <option value="">시/군/구 선택</option>
                  <option value="종로구">종로구</option>
                  <option value="강남구">강남구</option>
                  <option value="수원시">수원시</option>
                  <option value="부평구">부평구</option>
                </select>
              </div>

              <div className={styles.mapCommunityTop}>
                <form
                  className={styles.mapCommunitySearchWrap}
                  onSubmit={submitSearch}
                >
                  <select
                    className={`${styles.mapCommunitySelect} ${styles.searchTypeSelect}`}
                    value={type}
                    onChange={(e) => {
                      setType(Number(e.target.value));
                    }}
                  >
                    <option value={1}>제목</option>
                    <option value={2}>작성자</option>
                  </select>

                  <input
                    type="text"
                    className={styles.mapCommunityInput}
                    placeholder="검색어를 입력하세요..."
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                    }}
                  />

                  <button type="submit" className={styles.mapCommunityBtn}>
                    검색
                  </button>
                </form>

                <div className={styles.mapCommunityAction}>
                  {isLogin && (
                    <button
                      type="button"
                      className={styles.mapCommunityBtn}
                      onClick={() => setMode("write")}
                    >
                      게시글 작성
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.boardListBox}>
                {boardList.length > 0 ? (
                  boardList.map((board) => (
                    <div
                      className={styles.boardItem}
                      key={board.boardNo}
                      /* onClick={() => moveToDetail(board.boardNo)} //상세보기 기능 */
                    >
                      <div className={styles.boardItemTop}>
                        <div className={styles.boardWriter}>
                          <span className={styles.writerIcon}>👤</span>
                          <span>{board.writerNickname}</span>
                        </div>
                        <div className={styles.boardDate}>
                          {board.createDate}
                        </div>
                      </div>

                      <div className={styles.boardTitle}>
                        {board.boardTitle}
                      </div>

                      {board.thumbnailUrl && (
                        <div className={styles.boardThumbnailBox}>
                          <div className={styles.boardThumbnail}>썸네일</div>
                        </div>
                      )}

                      <div className={styles.boardItemBottom}>
                        <span className={styles.iconItem}>
                          <FavoriteBorderIcon fontSize="small" />
                          <span>{board.likeCount ?? 0}</span>
                        </span>

                        <span className={styles.iconItem}>
                          <ChatIcon fontSize="small" />
                          <span>{board.commentCount ?? 0}</span>
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyBoard}>
                    등록된 게시글이 없습니다.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.boardWriteWrap}>
              <div className={styles.boardWriteHeader}>
                <button
                  type="button"
                  className={styles.boardBackBtn}
                  onClick={() => setMode("list")}
                >
                  ‹
                </button>
                <h3>게시글 작성</h3>
              </div>

              <div className={styles.boardWriteScroll}>
                <div className={styles.boardWriteGroup}>
                  <label>제목</label>
                  <input
                    type="text"
                    className={styles.boardWriteInput}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className={styles.boardWriteGroup}>
                  <label>내용</label>
                  <TextEditor data={content} setData={setContent} />
                </div>

                <div className={styles.boardWriteGroup}>
                  <label>오늘의 내 탄소배출량은?</label>
                  <div className={styles.carbonBox}>탄소계산 ⊞</div>
                </div>

                <div className={styles.boardWriteGroup}>
                  <label>장소</label>
                  <div className={styles.writeMapBox}>MAP</div>
                </div>

                <div className={styles.boardWriteNotice}>
                  <p>
                    탄소커넥트는 누구나 기분 좋게 참여할 수 있는 커뮤니티를
                    만들기 위해 커뮤니티 이용규칙을 제정하여 운영하고 있습니다.
                  </p>

                  <p>
                    위반 시 게시물이 삭제되고 서비스 이용이 일정 기간 제한될 수
                    있습니다.
                  </p>

                  <p>
                    아래는 핵심 요약 사항이며, 게시물 작성 전 반드시
                    확인해주세요.
                  </p>

                  <ul>
                    <li>
                      <strong>정치/사회 관련 행위 금지</strong>
                      <br />
                      국가기관, 정치단체, 언론, 시민단체 관련 언급 및 의견 표현
                      금지
                    </li>

                    <li>
                      <strong>홍보 및 판매 금지</strong>
                      <br />
                      영리 여부와 관계없이 사업체/개인 홍보, 바이럴 행위 금지
                    </li>

                    <li>
                      <strong>불법 촬영물 금지</strong>
                      <br />
                      관련 법률에 따라 삭제 및 이용 제한 가능
                    </li>

                    <li>
                      <strong>기타 금지 행위</strong>
                      <br />
                      욕설, 혐오, 차별, 폭력, 음란물, 공포/속임 콘텐츠 등
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  className={styles.boardSubmitBtn}
                  onClick={submitWrite}
                >
                  작성 완료
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Community;
