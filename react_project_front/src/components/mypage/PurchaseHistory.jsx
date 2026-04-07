import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import styles from "./PurchaseHistory.module.css";
import { getCompletedPurchases } from "./orderHistoryStorage";

const PAGE_SIZE = 9;
const getStatusPrefix = (status) => (status ? `[${status}] ` : "");

const PurchaseHistory = () => {
  const { memberId } = useAuthStore();
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setPurchaseHistory(getCompletedPurchases(memberId));
  }, [memberId]);

  const pageCount = Math.max(1, Math.ceil(purchaseHistory.length / PAGE_SIZE));

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return purchaseHistory.slice(start, start + PAGE_SIZE);
  }, [currentPage, purchaseHistory]);

  const changePage = (page) => {
    if (page < 1 || page > pageCount) return;
    setCurrentPage(page);
  };

  return (
    <div className={styles.purchase_history_wrap}>
      <h3 className={styles.purchase_title}>구매내역</h3>
      <div className={styles.purchase_list}>
        {purchaseHistory.length === 0 && <p>실제 결제 완료 내역이 없습니다.</p>}
        {currentItems.map((item) => (
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
      {pageCount > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.pagination_button}
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <div className={styles.page_numbers}>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={`${styles.pagination_button} ${currentPage === page ? styles.pagination_buttonActive : ""}`}
                onClick={() => changePage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={styles.pagination_button}
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === pageCount}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
