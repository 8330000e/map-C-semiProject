import { useEffect, useState } from "react";
import styles from "./Bestpostlist.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Bestpostlist = () => {
  const navigate = useNavigate();
  const [bestPost, setBestPost] = useState([]);
  const [bestPostList, setBestPostList] = useState([]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/boards/best`)
      .then((res) => {
        // 인기 게시글 데이터를 상태에 저장하거나 필요한 작업 수행
        console.log(res.data);
        setBestPostList(res.data);
      })
      .catch((err) => {
        // 이전에는 console.err를 사용하여 오류가 발생했습니다.
        // console.error로 변경하여 콘솔에 정상적으로 출력되도록 합니다.
        console.error("인기 게시글 데이터를 가져오는 중 오류 발생:", err);
      });
  }, []);
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
