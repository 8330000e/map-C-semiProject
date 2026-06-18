import styles from "./MyPageBoard.module.css";
import { Input } from "../ui/Form";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";

const PAGE_SIZE = 10;
const PAGE_BUTTONS = 5;

// 이 컴포넌트는 마이페이지 내 게시물 목록을 보여주는 영역임.
// 검색어를 입력하고 '검색' 버튼을 누르면 해당 회원의 게시물을 다시 불러오게 함.
// 검색 버튼은 아이콘 대신 텍스트 버튼으로 변경해서 사용자가 검색 기능을 더 쉽게 이해하도록 함.
const MyBoard = () => {
  const navigate = useNavigate();
  const { memberId, memberNickname } = useAuthStore();
  const [boardSearch, setBoardSearch] = useState("");
  const [searchBoard, setSearchBoard] = useState("");
  const [filter, setFilter] = useState(2);
  const [boardList, setBoardList] = useState([]);
  const [page, setPage] = useState(1);
  const checker = 1;

  useEffect(() => {
    if (!memberId) return;
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/boards/${memberId}?searchBoard=${searchBoard}&filter=${filter}&checker=${checker}`,
      )
      .then((res) => {
        setBoardList(res.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [memberId, searchBoard, filter]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchBoard(boardSearch);
  };

  useEffect(() => {
    setPage(1);
  }, [searchBoard, filter, memberId]);

  const pageCount = Math.max(1, Math.ceil(boardList.length / PAGE_SIZE));
  const visibleBoardList = boardList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const boardView = (boardNo) => {
    if (boardNo) {
      navigate(`/map-community?boardNo=${boardNo}`);
    }
  };

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
            key={`mypage-board-page-${pageNumber}`}
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
        <h3>나의 게시물</h3>
        <span className={styles.board_count}>{boardList.length}건</span>
      </div>
      <div className={styles.board_content_wrap}>
        <div className={styles.board_search_wrap}>
          {/* 검색 input과 검색 버튼을 한 줄에 정렬합니다. */}
          <form className={styles.search_form} onSubmit={handleSearchSubmit}>
            <Input
              id="boardSearch"
              name="BoardTitle"
              value={boardSearch}
              onChange={(e) => {
                setBoardSearch(e.target.value);
              }}
              placeholder="검색어를 입력하세요"
            />
            {/* 버튼은 입력창 우측에 배치되어 검색 흐름을 자연스럽게 만듭니다. */}
            <button type="submit" className={styles.search_button}>
              검색
            </button>
          </form>
          {/* 정렬 필터는 오른쪽 끝에 배치하여 검색 입력과 구분되도록 합니다. */}
          <select
            value={filter}
            onChange={(e) => {
              setFilter(Number(e.target.value));
            }}>

            <option value={1}>최신순</option>
            <option value={2}>오래된순</option>
            <option value={3}>최소조회수</option>
            <option value={4}>최대조회수</option>
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
              {visibleBoardList.map((board) => (
                <ul
                  key={board.boardNo}
                  className={`${styles.one_board} ${styles.clickable_row}`}
                  onClick={() => boardView(board.boardNo)}
                >
                  <li>{board.boardNo}</li>
                  <li>{board.boardDate ? board.boardDate.slice(0, 10) : "-"}</li>
                  <li>{board.memberNickname || board.writerId || memberNickname || memberId}</li>
                  <li>{board.boardTitle}</li>
                  <li>{board.readCount}</li>
                </ul>
              ))}
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

export default MyBoard;
