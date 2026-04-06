import styles from "./MyBoard.module.css";
import { Input } from "../ui/Form";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import axios from "axios";
import { memberId } from "../../store/useAuthStore";

const MyBoard = () => {
  const [boardSearch, setBoardSearch] = useState("");
  const [searchBoard, setSearchBoard] = useState();
  const [filter, setFilter] = useState(2);
  const [boardList, setBoardList] = useState({
    memberId: "memberId",
    boardNo: "",
    memberNickName: "",
    boardTitle: "",
    boardThumb: "",
    boardDate: "",
    readCount: "",
    searchBoard: searchBoard,
    filter: filter,
  });
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/${memberId}`, boardList)
      .then((res) => {
        console.log(res.data);
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
            onClick={(e) => {
              setFilter(e.target.value);
            }}
          >
            <option value={1}>오래된순</option>
            <option value={2}>최신순</option>
            <option value={3}>최소조회수</option>
            <option value={4}>최대조회수</option>
          </select>
        </div>
        <div className={styles.myboard_content_wrap}>
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyBoard;
