import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import styles from "./PurchaseHistory.module.css";
import { getCompletedPurchases } from "./orderHistoryStorage";

const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";
const PAGE_SIZE = 6;
const getStatusPrefix = (status) => (status ? `[${status}] ` : "");

const getImageUrl = (thumb) => {
  // thumb가 서버에서 여러 형태로 들어오기 때문에,
  // 여기서 브라우저가 바로 쓸 수 있는 주소로 바꿔줘요.
  if (!thumb) return null;
  if (typeof thumb !== "string") return null;
  let trimmed = thumb.trim();
  if (!trimmed) return null;

  trimmed = trimmed.replace(/\\\\/g, "/").replace(/\\/g, "/");

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;

  const driveMatch = trimmed.match(/^[A-Za-z]:\//);
  if (driveMatch) {
    const boardIndex = trimmed.indexOf("/board/editor/");
    if (boardIndex !== -1) {
      const suffix = trimmed.substring(boardIndex);
      return `${BACKSERVER}${suffix.startsWith("/") ? "" : "/"}${suffix}`;
    }
    trimmed = trimmed.substring(trimmed.indexOf("/") + 1);
  }

  if (trimmed.startsWith("/")) return `${BACKSERVER}${trimmed}`;
  if (trimmed.includes("/upload/")) return `${BACKSERVER}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  if (trimmed.includes("/board/editor/")) return `${BACKSERVER}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  if (trimmed.match(/^.+\.(jpg|jpeg|png|gif|bmp)$/i)) return `${BACKSERVER}/board/editor/${trimmed.replace(/^\//, "")}`;
  return `${BACKSERVER}/board/editor/${trimmed}`;
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

// 구매내역 페이지 기능임. 로그인한 사용자가 완료한 구매 내역을 보여줌.
//  - 구매 상품 목록을 페이지 단위로 렌더링함.
//  - 각 주문의 배송 정보는 추가 API 호출로 가져옴.
const PurchaseHistory = () => {
  const { memberId } = useAuthStore();
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [tradeInfoMap, setTradeInfoMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setPurchaseHistory(getCompletedPurchases(memberId));
  }, [memberId]);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";
    const currentItems = purchaseHistory.slice((currentPage - 1) * PAGE_SIZE, (currentPage - 1) * PAGE_SIZE + PAGE_SIZE);

    const fetchTradeInfo = async (marketNo) => {
      try {
        const url = `${backendUrl}/api/store/markets/${marketNo}/trade-info${memberId ? `?buyerId=${memberId}` : ""}`;
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
  }, [purchaseHistory, currentPage, memberId, tradeInfoMap]);

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
      <section className={styles.purchase_status_section}>
        <div className={styles.status_header}>
          <h3 className={styles.purchase_title}>구매내역</h3>
          <span>{purchaseHistory.length}건</span>
        </div>
        <div className={styles.purchase_list}>
          {purchaseHistory.length === 0 && <p>실제 결제 완료 내역이 없습니다.</p>}
          {currentItems.map((item) => {
          const marketNo = item.marketNo ?? item.id;
          const tradeInfo = marketNo ? tradeInfoMap[marketNo] : null;
          const displayShippingStatus = tradeInfo?.shippingStatus ?? item.shippingStatus;
          const displayCourierCode = tradeInfo?.courierCode ?? item.courierCode;
          const displayInvoiceNumber = tradeInfo?.invoiceNumber ?? item.invoiceNumber;
          const address = item.orderInfo?.address || item.address || "";
          const displayTradeType = resolveTradeType(item.tradeType, item.tradeTypeText, item.deliveryMethod, address);
          const hasDelivery = displayTradeType === "택배" || displayTradeType === "직거래/택배";
          const itemTitle = item.title || item.marketTitle || item.orderName || "상품 이미지";
          const imageUrl = getImageUrl(item.productThumb || item.thumb || tradeInfo?.productThumb);

          return (
            <Link
              key={item.id}
              to={`/mypage/history/purchase/${item.id}`}
              className={styles.purchase_card}
            >
              <div className={styles.purchase_card_image_wrap}>
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={itemTitle}
                    className={styles.purchase_card_image}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className={styles.purchase_card_image_fallback}>이미지</div>
                )}
              </div>
              <div className={styles.purchase_card_title}>{getStatusPrefix(item.status)}{itemTitle}</div>
              <div className={styles.purchase_card_meta}>{item.date} · {item.status}</div>
              <div className={styles.purchase_card_detail}>{item.amount?.toLocaleString("ko-KR")}원</div>
              <div className={styles.purchase_card_detail}>거래방법: {displayTradeType}</div>
              {hasDelivery && (
                <>
                  <div className={styles.purchase_card_detail}>배송 상태: {getShippingStatusLabel(displayShippingStatus)}</div>
                  <div className={styles.purchase_card_detail}>택배사: {getCourierLabel(displayCourierCode)}</div>
                  {displayInvoiceNumber ? <div className={styles.purchase_card_detail}>송장번호: {displayInvoiceNumber}</div> : null}
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
      </section>
    </div>
  );
};

export default PurchaseHistory;
