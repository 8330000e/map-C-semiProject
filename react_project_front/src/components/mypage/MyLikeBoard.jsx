import { useEffect, useState } from "react";
import styles from "./MyPageBoard.module.css";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import SearchIcon from "@mui/icons-material/Search";
import { Input } from "../ui/Form";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;
const PAGE_BUTTONS = 5;

// 이 컴포넌트는 마이페이지 내 좋아요 누른 게시물 목록을 보여주는 영역임.
// 검색어 입력 후 '검색' 버튼을 누르면 좋아요 목록을 다시 불러오며, 필터로 정렬 기준을 바꿀 수 있음.
// 버튼을 텍스트 '검색'으로 바꿔서 사용자가 기능을 직관적으로 알 수 있게 함.
const MyLikeBoard = () => {
  const navigate = useNavigate();
  const { memberId, memberNickname } = useAuthStore();
  const [boardSearch, setBoardSearch] = useState("");
  const [searchBoard, setSearchBoard] = useState("");
  const [filter, setFilter] = useState(2);
  const [likeBoardList, setLikeBoardList] = useState([]);
  const [page, setPage] = useState(1);
  const checker = 2;

  /* 좋아요 게시물 목록을 서버에서 가져오는 코드임. 검색어, 정렬, 회원 ID 바뀌면 다시 불러옴. */
  useEffect(() => {
    if (!memberId) return;

    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/boards/${memberId}?searchBoard=${searchBoard}&filter=${filter}&checker=${checker}`,
      )
      .then((res) => {
        setLikeBoardList(res.data || []);
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

  const pageCount = Math.max(1, Math.ceil(likeBoardList.length / PAGE_SIZE));
  const visibleBoardList = likeBoardList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
            key={`mylike-board-page-${pageNumber}`}
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
        <h3>내 좋아요 게시물</h3>
        <span className={styles.board_count}>{likeBoardList.length}건</span>
      </div>
      <div className={styles.board_content_wrap}>
        <div className={styles.board_search_wrap}>
          {/* 좋아요 게시물 검색 입력과 버튼을 한 줄로 배치함. */}
          <form className={styles.search_form} onSubmit={handleSearchSubmit}>
            <Input
              id="likeBoardSearch"
              name="BoardTitle"
              value={boardSearch}
              onChange={(e) => {
                setBoardSearch(e.target.value);
              }}
              placeholder="검색어를 입력하세요"
            />
            {/* 버튼은 입력창 우측에 위치하도록 함. */}
            <button type="submit" className={styles.search_button}>
              검색
            </button>
          </form>
          {/* 정렬 필터는 검색 영역의 오른쪽 끝에 정렬함. */}
          <select
            value={filter}
            onChange={(e) => {
              setFilter(Number(e.target.value));
            }}
          >
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
              {visibleBoardList.map((likeBoard) => (
                <ul
                  key={likeBoard.boardNo}
                  className={`${styles.one_board} ${styles.clickable_row}`}
                  onClick={() => boardView(likeBoard.boardNo)}
                >
                  <li>{likeBoard.boardNo}</li>
                  <li>{likeBoard.boardDate ? likeBoard.boardDate.slice(0, 10) : "-"}</li>
                  <li>{likeBoard.memberNickname || likeBoard.writerId || memberNickname || memberId}</li>
                  <li>{likeBoard.boardTitle}</li>
                  <li>{likeBoard.readCount}</li>
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

export default MyLikeBoard;
