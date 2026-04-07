import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { getCompletedSales } from "./orderHistoryStorage";
import styles from "./SaleHistory.module.css";
const PAGE_SIZE = 9;
const getSaleStatusLabel = (productStatus) => {
  if (productStatus === "예약중" || productStatus === 1 || productStatus === "1") return "예약중";
  if (productStatus === "판매완료" || productStatus === 2 || productStatus === "2") return "판매완료";
  return "판매중";
};

const SaleHistory = () => {
  const { memberId } = useAuthStore();
  const [salesHistory, setSalesHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!memberId) return;
    setSalesHistory(getCompletedSales(memberId));
  }, [memberId]);

  const pageCount = Math.max(1, Math.ceil(salesHistory.length / PAGE_SIZE));

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return salesHistory.slice(start, start + PAGE_SIZE);
  }, [currentPage, salesHistory]);

  const changePage = (page) => {
    if (page < 1 || page > pageCount) return;
    setCurrentPage(page);
  };

  return (
    <div className={styles.sale_history_wrap}>
      <h3 className={styles.sale_title}>판매내역</h3>
      <div className={styles.sale_list}>
        {salesHistory.length === 0 && <p>등록된 판매내역이 없습니다.</p>}
        {currentItems.map((item) => (
          <Link
            key={item.id}
            to={`/mypage/history/sale/${item.marketNo}`}
            className={styles.sale_card}
          >
            <div className={styles.sale_card_title}>[{item.status}] {item.title}</div>
            <div className={styles.sale_card_meta}>{item.date ? new Date(item.date).toLocaleDateString("ko-KR") : "-"} · {item.status}</div>
            <div>{Number(item.amount || 0).toLocaleString("ko-KR")}원</div>
            <div className={styles.sale_card_buyer}>구매자: {item.buyerNickname || item.buyerId}</div>
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

export default SaleHistory;
