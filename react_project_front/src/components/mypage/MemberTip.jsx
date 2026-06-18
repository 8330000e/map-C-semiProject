import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import styles from "./MyPageBoard.module.css";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { Input } from "../ui/Form";

const PAGE_SIZE = 10;
const PAGE_BUTTONS = 5;

// 이 컴포넌트는 마이페이지 내 팁 스크랩 목록을 보여주는 영역임.
// 검색어 입력 후 '검색' 버튼을 누르면 스크랩한 팁을 필터링해서 다시 보여줌.
// 검색 버튼을 텍스트로 바꾸고 버튼 높이를 입력창과 맞춰서 UI가 일관되도록 함.
const MemberTip = () => {
  const navigate = useNavigate();
  const checker = 3;
  const { memberId, memberNickname } = useAuthStore();
  const [tipBoardList, setTipBoardList] = useState([]);
  const [searchBoard, setSearchBoard] = useState("");
  const [filter, setFilter] = useState(2);
  const [boardSearch, setBoardSearch] = useState("");
  const [page, setPage] = useState(1);

  /* 팁 스크랩 목록을 서버에서 가져오는 코드임. 검색어, 필터, 회원 ID 바뀌면 다시 불러옴. */
  useEffect(() => {
    if (!memberId) return;

    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/boards/${memberId}?searchBoard=${searchBoard}&filter=${filter}&checker=${checker}`,
      )
      .then((res) => {
        setTipBoardList(res.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [memberId, searchBoard, filter]);

  /* 검색 버튼 누르면 검색어 상태를 갱신함. */
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchBoard(boardSearch);
  };

  /* 검색어나 필터 바뀌면 1페이지로 돌아가게 함. */
  useEffect(() => {
    setPage(1);
  }, [searchBoard, filter, memberId]);

  const pageCount = Math.max(1, Math.ceil(tipBoardList.length / PAGE_SIZE));
  const visibleBoardList = tipBoardList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* 페이지 번호가 범위를 넘으면 마지막 페이지로 맞춤. */
  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  /* 게시물을 클릭하면 상세 페이지로 이동함. */
  const boardView = (boardNo) => {
    if (boardNo) {
      navigate(`/map-community?boardNo=${boardNo}`);
    }
  };

  /* 페이지 버튼을 만들어서 보여줌. */
  const renderPagination = (currentPage, totalPage) => {
    const groupStart = Math.floor((currentPage - 1) / PAGE_BUTTONS) * PAGE_BUTTONS + 1;
    const groupEnd = Math.min(totalPage, groupStart + PAGE_BUTTONS - 1);

    return (
      <div className={styles.pagination}>
        <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
          &lt;
        </button>
        {Array.from({ length: groupEnd - groupStart + 1 }, (_, index) => groupStart + index).map((pageNumber) => (
          <button
            key={`member-tip-page-${pageNumber}`}
            type="button"
            className={pageNumber === currentPage ? styles.activePage : ""}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        <button type="button" disabled={currentPage === totalPage} onClick={() => setPage(currentPage + 1)}>
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div className={styles.board_main_wrap}>
      <div className={styles.board_title_wrap}>
        <h3>팁 스크랩</h3>
        <span className={styles.board_count}>{tipBoardList.length}건</span>
      </div>
      <div className={styles.board_content_wrap}>
        <div className={styles.board_search_wrap}>
          {/* 팁 검색 입력과 버튼을 한 줄로 배치함. */}
          <form className={styles.search_form} onSubmit={handleSearchSubmit}>
            <Input
              id="memberTipSearch"
              name="boardTitle"
              value={boardSearch}
              onChange={(e) => {
                setBoardSearch(e.target.value);
              }}
              placeholder="검색어를 입력하세요"
            />
            {/* 버튼은 입력창 우측에 둠. */}
            <button type="submit" className={styles.search_button}>
              검색
            </button>
          </form>
          {/* 정렬 필터는 오른쪽 끝에 둠. */}
          <select
            value={filter}
            onChange={(e) => {
              setFilter(Number(e.target.value));
            }}
          >
            <option value={1}>최신순</option>
            <option value={2}>오래된순</option>
            <option value={3}>최대조회수</option>
            <option value={4}>최소조회수</option>
          </select>
        </div>
        {visibleBoardList.length > 0 ? (
          <>
            <div className={styles.board_list_wrap}>
              <ul className={`${styles.one_board} ${styles.header_row}`}>
                <li>글번호</li>
                <li>작성일</li>
                <li>작성자</li>
                <li>제목</li>
                <li>조회수</li>
              </ul>
              {visibleBoardList.map((tip) => {
                const authorName = tip.writerNickname || tip.memberNickname || tip.writerId || "알 수 없음";
                return (
                  <ul
                    key={tip.boardNo}
                    className={`${styles.one_board} ${styles.clickable_row}`}
                    onClick={() => boardView(tip.boardNo)}
                  >
                    <li>{tip.boardNo}</li>
                    <li>{tip.boardDate ? tip.boardDate.slice(0, 10) : "-"}</li>
                    <li>{authorName}</li>
                    <li>{tip.boardTitle}</li>
                    <li>{tip.readCount}</li>
                  </ul>
                );
              })}
            </div>
            {pageCount > 1 && renderPagination(page, pageCount)}
          </>
        ) : (
          <div className={styles.empty_state}>검색 결과가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default MemberTip;
