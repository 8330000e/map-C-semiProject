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

const SaleHistory = () => {
  return (
    <div className={styles.sale_history_wrap}>
      <h3 className={styles.sale_title}>판매내역</h3>
      <div className={styles.sale_list}>
        {mockSalesHistory.map((item) => (
          <Link
            key={item.id}
            to={`/mypage/history/sale/${item.id}`}
            className={styles.sale_card}
          >
            <div className={styles.sale_card_title}>{item.title}</div>
            <div className={styles.sale_card_meta}>{item.date} · {item.status}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SaleHistory;
