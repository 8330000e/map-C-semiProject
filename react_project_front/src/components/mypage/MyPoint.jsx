import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../../store/useAuthStore";
import styles from "./MyPoint.module.css";

const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";

const MyPoint = () => {
  const { memberId } = useAuthStore();

  const [point, setPoint] = useState(0);
  const [history, setHistory] = useState([]); // 🔥 추가

  useEffect(() => {
    if (!memberId) return;

    // 총 포인트
    axios
      .get(`${BACKSERVER}/point-give/${memberId}`)
      .then((res) => {
        setPoint(res.data);
      })
      .catch((err) => {
        console.error("포인트 조회 실패", err);
      });

    // 🔥 포인트 사용 내역
    axios
      .get(`${BACKSERVER}/point-history/${memberId}`)
      .then((res) => {
        console.log("포인트 내역:", res.data);
        setHistory(res.data);
      })
      .catch((err) => {
        console.error("포인트 내역 조회 실패", err);
      });
  }, [memberId]);

  return (
    <div className={styles.pointCard}>
      <h2 className={styles.pointTitle}>포인트 사용내역</h2>

      <div className={styles.pointSummary}>
        <p>총 포인트: {point}p</p>
        <p>포인트 내역</p>
      </div>

      <div className={styles.pointListBox}>
        {history.length === 0 ? (
          <p>내역이 없습니다.</p>
        ) : (
          history.map((item) => (
            <div className={styles.pointItem} key={item.contributionNo}>
              <div>
                <p className={styles.date}>{item.contributedAt}</p>
                <p>나무 키우기</p> {/* 필요하면 regionName으로 변경 */}
              </div>
              <span className={styles.pointValue}>
                -{item.contributedPoint}p
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyPoint;
