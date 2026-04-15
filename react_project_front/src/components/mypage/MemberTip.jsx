import { useEffect, useState } from "react";
import useAuthStore from "../../store/useAuthStore";
import styles from "./MyPageBoard.module.css";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import { Input } from "../ui/Form";

const MemberTip = () => {
  const checker = 3;
  // 팁 스크랩 페이지임.
  //  - 사용자가 스크랩한 팁을 검색하고 정렬해서 볼 수 있는 화면임.
  //  - 검색어 입력 후 돋보기 버튼을 눌러서 목록을 갱신함.
  const { memberId } = useAuthStore();
  const [tipBoardList, setTipBoardList] = useState([]);
  const [searchBoard, setSearchBoard] = useState("");
  const [filter, setFilter] = useState(2);
  const [boardSearch, setBoardSearch] = useState("");

  // 스크랩한 팁 목록을 서버에서 가져오는 로직임.
  //  - 검색어(searchBoard)와 정렬 필터(filter)에 따라 목록을 갱신함.
  //  - 검색 버튼 클릭 시 boardSearch 상태를 searchBoard로 복사해서 상단 useEffect를 트리거함.
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
    <div className={styles.board_main_wrap}>
      <div className={styles.board_title_wrap}>
        <h3>팁 스크랩</h3>
      </div>
      <div className={styles.board_content_wrap}>
        <div className={styles.board_search_wrap}>
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
        {tipBoardList && (
          <div className={styles.board_list_wrap}>
            {tipBoardList.map((tip, index) => {
              const authorName = tip.writerNickname || tip.memberNickname || tip.writerId || "알 수 없음";
              return (
                <ul key={tip.boardTitle} className={styles.one_board}>
                  <li>{"글번호:" + tip.boardNo}</li>
                  <li>{"게시자:" + authorName}</li>
                  <li>{"등록일:" + tip.boardDate}</li>
                  <li>{"제목:" + tip.boardTitle}</li>
                  <li>{"조회수:" + tip.readCount}</li>
                </ul>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberTip;
