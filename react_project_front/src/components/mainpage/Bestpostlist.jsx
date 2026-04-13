import { useEffect, useState } from "react";
import styles from "./Bestpostlist.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 인기 게시물 목록 컴포넌트임.
//  - 서버에서 인기 게시물 데이터를 가져와서 리스트로 보여줌.
//  - 항목을 클릭하면 해당 게시물 상세 페이지로 이동함.
const Bestpostlist = () => {
  const navigate = useNavigate();
  const [bestPostList, setBestPostList] = useState([]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/best`, {
        params: {
          status: 0,
        },
      })
      .then((res) => {
        // 인기게시물은 맵커뮤니티의 기본 게시글 목록과 동일한 status=0 조건을 적용합니다.
        const bestPosts = Array.isArray(res.data) ? res.data : [];
        const validBestPosts = bestPosts.filter(
          (bestPost) =>
            bestPost?.boardNo || bestPost?.boardId || bestPost?.id,
        );
        console.log(validBestPosts);
        setBestPostList(validBestPosts);
      })
      .catch((err) => {
        // best post list .jsx 부분에 console.err로 되어있었음
        console.log("인기 게시글 데이터를 가져오는 중 오류 발생:", err);
      });
  }, []);
  const boardView = (boardNo) => {
    /*
      인기게시물 클릭 이동 로직임.
      1) 인기게시물 항목은 boardNo를 가지고 있어야 상세 페이지로 갈 수 있음.
      2) boardNo가 있으면 맵 커뮤니티 페이지로 이동하면서 쿼리 파라미터로 전달함.
         예: /map-community?boardNo=123
      3) boardNo가 없으면 안전하게 맵 커뮤니티 메인으로 이동함.
         (boardNo가 없을 때는 상세 페이지를 표시할 수 없기 때문임)
    */
    if (boardNo) {
      navigate(`/map-community?boardNo=${boardNo}`);
    } else {
      navigate("/map-community");
    }
  };
  return (
    <div className={styles.bestpostlist}>
      <div>인기 게시글</div>
      {bestPostList.map((bestPost, i) => {
        const boardNo = bestPost?.boardNo ?? bestPost?.boardId ?? bestPost?.id ?? null;
        return (
          <ul key={`${bestPost}+${i}`} className={styles.list_wrap}>
            <li
              className={styles.list_item}
              style={{ cursor: "pointer" }}
              onClick={() => boardView(boardNo)}
            >
              <p>{i + 1}</p>
              <p>{bestPost.boardTitle}</p>
              <p>{bestPost.sgg}</p>
            </li>
          </ul>
        );
      })}
    </div>
  );
};

export default Bestpostlist;
