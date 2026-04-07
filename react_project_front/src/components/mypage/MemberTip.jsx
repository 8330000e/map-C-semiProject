import { useEffect, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import styles from "./MyPageBoard.module.css";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { Input } from "../ui/Form";

const MemberTip = () => {
  const checker = 3;
  const { memberId } = useAuthStore();
  const [tipBoardList, setTipBoardList] = useState([]);
  const [searchBoard, setSearchBoard] = useState("");
  const [filter, setFilter] = useState(2);
  const [boardSearch, setBoardSearch] = useState("");
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKSERVER}/boards/${memberId}?searchBoard=${searchBoard}&filter=${filter}&checker=${checker}`,
      )
      .then((res) => {
        console.log(res);
        setTipBoardList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchBoard, filter]);
  return (
    <div className={styles.membertip_wrap}>
      <div className={styles.membertip_title_wrap}>
        <h3>팁 스크랩</h3>
      </div>
      <div className={styles.membertip_content_wrap}>
        <div className={styles.membertip_search_wrap}>
          <label
            htmlFor="memberTipSearch"
            onClick={() => {
              setSearchBoard(boardSearch);
            }}
          >
            <SearchIcon />
          </label>
          <Input
            id="memberTipSearch"
            name="boardTitle"
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
            <option value={3}>최대조회수</option>
            <option value={4}>최소조회수</option>
          </select>
        </div>
        <div className={styles.membertip_list_wrap}>
          {tipBoardList.map((tip, index) => {
            return (
              <ul key={tip.boardTitle}>
                <li>{"글번호:" + tip.boardNo}</li>
                <li>{"게시자:" + tip.writerId}</li>
                <li>{"등록일:" + tip.boardDate}</li>
                <li>{"제목:" + tip.boardTitle}</li>
                <li>{"조회수:" + tip.readCount}</li>
              </ul>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MemberTip;
