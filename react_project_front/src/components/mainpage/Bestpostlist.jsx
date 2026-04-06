import { useEffect, useState } from "react";
import styles from "./Bestpostlist.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Bestpostlist = () => {
  const navigate = useNavigate();
  const [bestPostList, setBestPostList] = useState([]);
  const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";

  useEffect(() => {
    const url = `${BACKSERVER}/boards/best`;
    axios
      .get(url)
      .then((res) => {
        const data = res.data;
        console.log("Bestpostlist response:", data);
        if (!Array.isArray(data)) {
          console.error("Bestpostlist: expected array but got:", data);
          setBestPostList([]);
          return;
        }
        setBestPostList(data);
      })
      .catch((err) => {
        console.error("인기 게시글 데이터를 가져오는 중 오류 발생:", err);
      });
  }, [BACKSERVER]);
  const boardView = (i) => {
    navigate("/map-community");
    //navigate(`/map-community/${i}`);
  };
  return (
    <div className={styles.bestpostlist}>
      <div>인기 게시글</div>
      {bestPostList.map((bestPost, i) => {
        return (
          <ul key={`${bestPost}+${i}`} className={styles.list_wrap}>
            <li className={styles.list_item} onClick={() => boardView(i)}>
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
