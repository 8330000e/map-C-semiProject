import React from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./SaleHistory.module.css";

const mockSalesHistory = [
  { id: 1, title: "업사이클 백팩", date: "2026-03-15", amount: 34000, status: "판매중", tradeType: 0, tradeTypeText: "직거래/택배" },
  { id: 2, title: "중고 모니터 24인치", date: "2026-03-06", amount: 83000, status: "판매완료", tradeType: 1, tradeTypeText: "직거래" },
];

const tradeTypeLabel = (type, text) => {
  if (text) return text;
  if (type === 0) return "직거래/택배";
  if (type === 1) return "직거래";
  if (type === 2) return "택배";
  return "-";
};

const mockSaleReviews = {
  2: [
    {
      id: 1,
      buyer: "그린북구매자",
      score: 5,
      text: "배송이 빠르고 상품 상태도 매우 좋았습니다. 감사합니다!",
      date: "2026-03-10",
    },
  ],
};

const SaleDetail = () => {
  const { id } = useParams();
  const item = mockSalesHistory.find((p) => String(p.id) === String(id));

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

  const reviews = mockSaleReviews[item.id] || [];

  return (
    <div className={styles.sale_history_wrap}>
      <h3 className={styles.sale_title}>판매 상세 ({item.title})</h3>
      <div className={styles.sale_card}>
        <div className={styles.sale_card_title}>{item.title}</div>
        <div className={styles.sale_card_meta}>{item.date} · {item.status}</div>
        <div>금액: {item.amount.toLocaleString()}원</div>
        <div>거래방법: {tradeTypeLabel(item.tradeType, item.tradeTypeText)}</div>
      </div>

      {item.status === "판매완료" ? (
        <div className={styles.review_summary}>
          <h4>구매자 후기</h4>
          {reviews.length === 0 ? (
            <p>아직 등록된 후기가 없습니다.</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className={styles.review_card}>
                <div className={styles.review_score}>★ {rev.score}</div>
                <div className={styles.review_meta}>{rev.buyer} · {rev.date}</div>
                <p>{rev.text}</p>
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
