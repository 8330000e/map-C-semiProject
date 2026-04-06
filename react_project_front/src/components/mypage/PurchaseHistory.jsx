import React from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./PurchaseHistory.module.css";

const mockPurchaseHistory = [
  { id: 1, title: "재생 우드 의자", date: "2026-03-22", amount: 75000, status: "구매완료", tradeType: 0, tradeTypeText: "직거래/택배", seller: "업사이클샵" },
  { id: 2, title: "중고 노트북", date: "2026-03-18", amount: 430000, status: "배송대기", tradeType: 2, tradeTypeText: "택배", seller: "노트북박사" },
];

const tradeTypeLabel = (type, text) => {
  if (text) return text;
  if (type === 0) return "직거래/택배";
  if (type === 1) return "직거래";
  if (type === 2) return "택배";
  return "-";
};

const PurchaseHistory = () => {
  return (
    <div className={styles.purchase_history_wrap}>
      <h3 className={styles.purchase_title}>구매내역</h3>
      <div className={styles.purchase_list}>
        {mockPurchaseHistory.map((item) => (
          <Link
            key={item.id}
            to={`/mypage/history/purchase/${item.id}`}
            className={styles.purchase_card}
          >
            <div className={styles.purchase_card_title}>{item.title}</div>
            <div className={styles.purchase_card_meta}>{item.date} · {item.status}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PurchaseHistory;
