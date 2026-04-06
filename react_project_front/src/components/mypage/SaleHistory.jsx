import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import styles from "./SaleHistory.module.css";
const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";
const getSaleStatusLabel = (productStatus) => (productStatus === 2 ? "판매완료" : productStatus === 1 ? "예약중" : "판매중");

const SaleHistory = () => {
  const { memberId } = useAuthStore();
  const [salesHistory, setSalesHistory] = useState([]);

  useEffect(() => {
    if (!memberId) return;
    axios.get(`${BACKSERVER}/api/store/boards`)
      .then((res) => {
        const boards = Array.isArray(res.data) ? res.data : [];
        setSalesHistory(boards.filter((item) => item.memberId === memberId));
      })
      .catch((error) => {
        console.error("판매내역 조회 실패", error);
        setSalesHistory([]);
      });
  }, [memberId]);

  return (
    <div className={styles.sale_history_wrap}>
      <h3 className={styles.sale_title}>판매내역</h3>
      <div className={styles.sale_list}>
        {salesHistory.length === 0 && <p>등록된 판매내역이 없습니다.</p>}
        {salesHistory.map((item) => (
          <Link
            key={item.marketNo}
            to={`/mypage/history/sale/${item.marketNo}`}
            className={styles.sale_card}
          >
            <div className={styles.sale_card_title}>[{getSaleStatusLabel(item.productStatus)}] {item.marketTitle}</div>
            <div className={styles.sale_card_meta}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("ko-KR") : "-"} · {getSaleStatusLabel(item.productStatus)}</div>
            <div>{Number(item.productPrice || 0).toLocaleString("ko-KR")}원</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SaleHistory;
