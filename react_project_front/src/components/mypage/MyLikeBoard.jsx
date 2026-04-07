import { useEffect, useState } from "react";
import styles from "./MyPageBoard.module.css";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import SearchIcon from "@mui/icons-material/Search";
import { Input } from "../ui/Form";

const MyLikeBoard = () => {
  const { memberId } = useAuthStore();
  const [boardSearch, setBoardSearch] = useState("");
  const [likeBoardList, setLikeBoardList] = useState([]);
  const [searchBoard, setSearchBoard] = useState("");
  const [filter, setFilter] = useState(2);
  const checker = 2;
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/boards/${memberId}?searchBoard=${searchBoard}&filter=${filter}&checker=${checker}`,
      )
      .then((res) => {
        console.log(res.data);
        setLikeBoardList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchBoard, filter]);
  return (
    <div className={styles.board_main_wrap}>
      <div className={styles.board_title_wrap}>
        <h3>내 좋아요 게시물</h3>
      </div>
      <div className={styles.board_content_wrap}>
        <div className={styles.board_search_wrap}>
          <label
            htmlFor="likeBoardSearch"
            onClick={() => {
              setSearchBoard(boardSearch);
            }}
          >
            <SearchIcon />
          </label>
          <Input
            id="likeBoardSearch"
            name="BoardTitle"
            value={boardSearch}
            onChange={(e) => {
              setBoardSearch(e.target.value);
            }}
          ></Input>
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
        {likeBoardList && (
          <div className={styles.board_list_wrap}>
            {likeBoardList.map((likeBoard, index) => {
              return (
                <ul key={likeBoard.boardTitle} className={styles.one_board}>
                  <li>{"글번호:" + likeBoard.boardNo}</li>
                  <li>{"게시자:" + likeBoard.writerId}</li>
                  <li>{"게시일:" + likeBoard.boardDate}</li>
                  <li>{"제목:" + likeBoard.boardTitle}</li>
                  <li>{"조회수:" + likeBoard.readCount}</li>
                </ul>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLikeBoard;
