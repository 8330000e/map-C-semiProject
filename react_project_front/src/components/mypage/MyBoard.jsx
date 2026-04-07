import styles from "./MyPageBoard.module.css";
import { Input } from "../ui/Form";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";

const MyBoard = () => {
  const { memberId } = useAuthStore();
  const [boardSearch, setBoardSearch] = useState("");
  const [searchBoard, setSearchBoard] = useState("");
  const [filter, setFilter] = useState(2);
  const [boardList, setBoardList] = useState([]);
  const checker = 1;
  useEffect(() => {
    console.log(memberId);
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/boards/${memberId}?searchBoard=${searchBoard}&filter=${filter}&checker=${checker}`,
      )
      .then((res) => {
        console.log(res.data);
        setBoardList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchBoard, filter]);
  return (
    <div className={styles.board_main_wrap}>
      <h3>나의 게시물</h3>
      <div className={styles.board_content_wrap}>
        <div className={styles.board_search_wrap}>
          <label
            htmlFor="boardSearch"
            onClick={() => {
              setSearchBoard(boardSearch);
            }}
          >
            <SearchIcon />
          </label>
          <Input
            id="boardSearch"
            name="BoardTitle"
            value={boardSearch}
            onChange={(e) => {
              setBoardSearch(e.target.value);
            }}
          />

          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          >
            <option value={1}>최신순</option>
            <option value={2}>오래된순</option>
            <option value={3}>최소조회수</option>
            <option value={4}>최대조회수</option>
          </select>
        </div>
        {boardList && (
          <div className={styles.board_list_wrap}>
            {boardList.map((board, index) => {
              return (
                <ul key={board.boardNo} className={styles.one_board}>
                  <li>{"글번호" + board.boardNo}</li>
                  <li>{memberId}</li>
                  <li>{"게시일" + board.boardDate}</li>
                  <li>{"제목" + board.boardTitle}</li>
                  <li>{"조회수" + board.readCount}</li>
                </ul>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBoard;
