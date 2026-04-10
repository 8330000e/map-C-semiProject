import { useEffect, useState } from "react";
import styles from "./Bestpostlist.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
