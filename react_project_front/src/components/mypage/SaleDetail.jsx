import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import styles from "./SaleHistory.module.css";
const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";

const tradeTypeLabel = (type, text) => {
  if (text) return text;
  if (type === 0 || type === "0") return "직거래/택배";
  if (type === 1 || type === "1") return "직거래";
  if (type === 2 || type === "2") return "택배";
  return "-";
};

const SaleDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`${BACKSERVER}/api/store/boards/${id}`)
      .then((res) => setItem(res.data))
      .catch((error) => {
        console.error("판매상세 조회 실패", error);
        setItem(null);
      });
  }, [id]);

  useEffect(() => {
    if (!id) return;
    axios.get(`${BACKSERVER}/api/store/markets/${id}/ratings`)
      .then((res) => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch((error) => {
        console.error("판매후기 조회 실패", error);
        setReviews([]);
      });
  }, [id]);

  if (!item) {
    return (
      <div className={styles.sale_history_wrap}>
        <p className={styles.sale_title}>판매 상세를 찾을 수 없습니다.</p>
        <Link className={styles.sale_back_link} to="/mypage/history/sale">
          판매내역으로 돌아가기
        </Link>
      </div>
    );
  }
  const saleStatus = item.productStatus === 2 ? "판매완료" : item.productStatus === 1 ? "예약중" : "판매중";

  return (
    <div className={styles.sale_history_wrap}>
      <h3 className={styles.sale_title}>판매 상세 ([{saleStatus}] {item.marketTitle})</h3>
      <div className={styles.sale_card}>
        <div className={styles.sale_card_title}>[{saleStatus}] {item.marketTitle}</div>
        <div className={styles.sale_card_meta}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("ko-KR") : "-"} · {saleStatus}</div>
        <div>금액: {Number(item.productPrice || 0).toLocaleString("ko-KR")}원</div>
        <div>거래방법: {tradeTypeLabel(item.tradeType, item.tradeTypeText)}</div>
      </div>

      {saleStatus === "판매완료" ? (
        <div className={styles.review_summary}>
          <h4>구매자 후기</h4>
          {reviews.length === 0 ? (
            <p>아직 등록된 후기가 없습니다.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.reviewNo} className={styles.review_card}>
                <div className={styles.review_score}>★ {rev.rating}</div>
                <div className={styles.review_meta}>{rev.buyerNickname || rev.buyerId} · {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("ko-KR") : "-"}</div>
                <p>{rev.reviewContent}</p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className={styles.review_summary}>
          <p>판매완료 상태에서만 구매자 후기를 확인할 수 있습니다.</p>
        </div>
      )}

      <Link className={styles.sale_back_link} to="/mypage/history/sale">
        ← 판매내역으로 돌아가기
      </Link>
    </div>
  );
};

export default SaleDetail;
