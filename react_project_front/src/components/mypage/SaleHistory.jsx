import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { getCompletedSales } from "./orderHistoryStorage";
import styles from "./SaleHistory.module.css";
const PAGE_SIZE = 9;
const getSaleStatusLabel = (productStatus) => {
  if (productStatus === "예약중" || productStatus === 1 || productStatus === "1") return "예약중";
  if (productStatus === "판매완료" || productStatus === 2 || productStatus === "2" || productStatus === "구매완료") return "판매완료";
  return "판매중";
};

const getShippingStatusLabel = (status) => {
  if (status === 1 || status === "1") return "배송완료";
  return "배송전";
};

const getCourierLabel = (code) => {
  if (code === 1 || code === "1") return "CJ대한통운";
  if (code === 2 || code === "2") return "현대택배";
  if (code === 3 || code === "3") return "한진택배";
  if (code === 4 || code === "4") return "로젠택배";
  if (code === 5 || code === "5") return "우체국택배";
  return "미지정";
};

const resolveTradeType = (type, typeText, deliveryMethod, address) => {
  const normalized = String(type ?? typeText ?? deliveryMethod ?? "").trim();
  const addressExists = Boolean((address ?? "").toString().trim());
  if (normalized === "0" || normalized === "직거래/택배") return addressExists ? "택배" : "직거래";
  if (normalized === "1" || normalized === "직거래" || normalized === "direct") return "직거래";
  if (normalized === "2" || normalized === "택배" || normalized === "delivery") return "택배";
  return addressExists ? "택배" : "직거래";
};

const getTradeTypeLabel = (item) => {
  const address = item.orderInfo?.address || item.address || "";
  return resolveTradeType(item.tradeType, item.tradeTypeText, item.deliveryMethod, address);
};

const isDeliveryTrade = (item) => {
  const address = item.orderInfo?.address || item.address || "";
  const resolved = resolveTradeType(item.tradeType, item.tradeTypeText, item.deliveryMethod, address);
  return resolved === "택배" || resolved === "직거래/택배";
};

const SaleHistory = () => {
  const { memberId } = useAuthStore();
  const [salesHistory, setSalesHistory] = useState([]);
  const [tradeInfoMap, setTradeInfoMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!memberId) return;
    setSalesHistory(getCompletedSales(memberId));
  }, [memberId]);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";
    const currentItems = salesHistory.slice((currentPage - 1) * PAGE_SIZE, (currentPage - 1) * PAGE_SIZE + PAGE_SIZE);

    const fetchTradeInfo = async (marketNo) => {
      try {
        const url = `${backendUrl}/api/store/markets/${marketNo}/trade-info`;
        const res = await fetch(url);
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    };

    const loadTradeInfos = async () => {
      if (!memberId || currentItems.length === 0) return;
      const marketNos = currentItems
        .map((item) => item.marketNo ?? item.id)
        .filter((marketNo) => marketNo && !tradeInfoMap[marketNo]);
      if (marketNos.length === 0) return;

      const results = await Promise.all(marketNos.map((marketNo) => fetchTradeInfo(marketNo)));
      setTradeInfoMap((prev) => {
        const next = { ...prev };
        marketNos.forEach((marketNo, index) => {
          if (results[index]) next[marketNo] = results[index];
        });
        return next;
      });
    };

    loadTradeInfos();
  }, [salesHistory, currentPage, memberId, tradeInfoMap]);

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
        {currentItems.map((item) => {
          const marketNo = item.marketNo ?? item.id;
          const tradeInfo = marketNo ? tradeInfoMap[marketNo] : null;
          const displayShippingStatus = tradeInfo?.shippingStatus ?? item.shippingStatus;
          const displayCourierCode = tradeInfo?.courierCode ?? item.courierCode;
          const displayInvoiceNumber = tradeInfo?.invoiceNumber ?? item.invoiceNumber;
          const address = item.orderInfo?.address || item.address || "";
          const displayTradeType = resolveTradeType(item.tradeType, item.tradeTypeText, item.deliveryMethod, address);
          const hasDelivery = displayTradeType === "택배" || displayTradeType === "직거래/택배";

          return (
            <Link
              key={item.id}
              to={`/mypage/history/sale/${item.marketNo}`}
              className={styles.sale_card}
            >
              <div className={styles.sale_card_title}>[{getSaleStatusLabel(item.status)}] {item.title}</div>
              <div className={styles.sale_card_meta}>{item.date ? new Date(item.date).toLocaleDateString("ko-KR") : "-"} · {getSaleStatusLabel(item.status)}</div>
              <div>{Number(item.amount || 0).toLocaleString("ko-KR")}원</div>
              <div>거래방법: {displayTradeType}</div>
              {item.buyerId || item.buyerNickname ? (
                <div className={styles.sale_card_buyer}>구매자: {item.buyerNickname || item.buyerId}</div>
              ) : null}
              {hasDelivery && (
                <>
                  <div>배송 상태: {getShippingStatusLabel(displayShippingStatus)}</div>
                  <div>택배사: {getCourierLabel(displayCourierCode)}</div>
                  {displayInvoiceNumber ? <div>송장번호: {displayInvoiceNumber}</div> : null}
                </>
              )}
            </Link>
          );
        })}
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
