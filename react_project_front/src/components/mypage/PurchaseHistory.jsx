import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./PurchaseHistory.module.css";
import { getCompletedPurchases } from "./orderHistoryStorage";

const getStatusPrefix = (status) => (status ? `[${status}] ` : "");

const PurchaseHistory = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    setPurchaseHistory(getCompletedPurchases());
  }, []);

  return (
    <div className={styles.purchase_history_wrap}>
      <h3 className={styles.purchase_title}>구매내역</h3>
      <div className={styles.purchase_list}>
        {purchaseHistory.length === 0 && <p>실제 결제 완료 내역이 없습니다.</p>}
        {purchaseHistory.map((item) => (
          <Link
            key={item.id}
            to={`/mypage/history/purchase/${item.id}`}
            className={styles.purchase_card}
          >
            <div className={styles.purchase_card_title}>{getStatusPrefix(item.status)}{item.title}</div>
            <div className={styles.purchase_card_meta}>{item.date} · {item.status}</div>
            <div>{item.amount?.toLocaleString("ko-KR")}원</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PurchaseHistory;
