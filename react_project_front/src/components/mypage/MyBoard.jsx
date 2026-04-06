import styles from "./MyBoard.module.css";
import { Input } from "../ui/Form";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";

const MyBoard = () => {
  const { memberId } = useAuthStore();
  const [boardSearch, setBoardSearch] = useState("");
  const [searchBoard, setSearchBoard] = useState("shit");
  const [filter, setFilter] = useState(2);
  const [boardList, setBoardList] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/boards/${memberId}?searchBoard=${searchBoard}&filter=${filter}`,
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
    <div className={styles.myboard_wrap}>
      <h3>나의 게시물</h3>
      <div>
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
        <div className={styles.myboard_filter}>
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
        <div className={styles.myboard_content_wrap}>
          {boardList.map((board, index) => {
            return (
              <ul key={board.boardNo}>
                <li>{board.boardNo}</li>
                <li>{memberId}</li>
                <li>{board.boardDate}</li>
                <li>{board.boardTitle}</li>
                <li>{board.readCount}</li>
              </ul>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyBoard;
