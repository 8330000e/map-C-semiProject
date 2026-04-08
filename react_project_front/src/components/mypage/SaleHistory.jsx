import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { getCompletedSales } from "./orderHistoryStorage";
import styles from "./SaleHistory.module.css";

const PAGE_SIZE = 3;

const normalizeStatus = (status) => String(status ?? "").replace(/\s+/g, "").trim();

const getSaleStatusLabel = (productStatus) => {
  const normalized = normalizeStatus(productStatus);
  if (normalized === "예약중" || normalized === "1") return "예약중";
  if (normalized === "판매완료" || normalized === "2" || normalized === "구매완료") return "판매완료";
  return "판매중";
};

const getShippingStatusLabel = (status) => {
  const normalized = String(status ?? "").trim();
  if (!normalized) return null;
  if (
    normalized === "1" ||
    normalized === "배송완료" ||
    normalized === "배송 완료" ||
    normalized === "판매완료" ||
    normalized === "구매완료"
  ) {
    return "배송완료";
  }
  if (
    normalized === "0" ||
    normalized === "배송전" ||
    normalized === "배송 전" ||
    normalized === "배송대기" ||
    normalized === "배송 대기"
  ) {
    return "배송전";
  }
  if (normalized.includes("완료")) return "배송완료";
  return null;
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

const getShippingStatusValue = (item, tradeInfo) => {
  if (tradeInfo?.shippingStatus != null) return tradeInfo.shippingStatus;
  if (item.shippingStatus != null) return item.shippingStatus;
  return null;
};

const getTradeInfoForItem = (item, tradeInfoMap) => {
  const marketNo = item.marketNo ?? item.id;
  return marketNo ? tradeInfoMap[marketNo] : null;
};

const getItemTitle = (item) => {
  return item.title || item.marketTitle || item.marketName || item.boardTitle || "";
};

const hasSellingTag = (item) => {
  return getItemTitle(item).includes("[판매중]");
};

const isBoardSelling = (item) => {
  return getSaleStatusLabel(item.productStatus) === "판매중";
};

const SaleHistory = () => {
  const { memberId } = useAuthStore();
  const [salesHistory, setSalesHistory] = useState([]);
  const [sellerBoards, setSellerBoards] = useState([]);
  const [tradeInfoMap, setTradeInfoMap] = useState({});
  const [sellingPage, setSellingPage] = useState(1);
  const [deliveryWaitingPage, setDeliveryWaitingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);

  useEffect(() => {
    if (!memberId) return;
    setSalesHistory(getCompletedSales(memberId));
  }, [memberId]);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";

    const loadSellerBoards = async () => {
      if (!memberId) return;
      try {
        const res = await axios.get(`${backendUrl}/api/store/boards`);
        const items = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.items)
          ? res.data.items
          : Array.isArray(res.data?.list)
          ? res.data.list
          : [];
        setSellerBoards(items.filter((board) => String(board.memberId) === String(memberId)));
      } catch (error) {
        console.error("판매자 게시물 조회 실패", error);
      }
    };

    const loadTradeInfos = async () => {
      if (!memberId || salesHistory.length === 0) return;
      const marketNos = Array.from(
        new Set(
          salesHistory
            .map((item) => item.marketNo ?? item.id)
            .filter((marketNo) => marketNo && !tradeInfoMap[marketNo]),
        ),
      );
      if (marketNos.length === 0) return;

      const results = await Promise.all(
        marketNos.map(async (marketNo) => {
          try {
            const url = `${backendUrl}/api/store/markets/${marketNo}/trade-info`;
            const res = await fetch(url);
            if (!res.ok) return null;
            return await res.json();
          } catch {
            return null;
          }
        }),
      );

      setTradeInfoMap((prev) => {
        const next = { ...prev };
        marketNos.forEach((marketNo, index) => {
          if (results[index]) next[marketNo] = results[index];
        });
        return next;
      });
    };

    loadSellerBoards();
    loadTradeInfos();
  }, [memberId, salesHistory, tradeInfoMap]);

  const sellingItems = useMemo(
    () => sellerBoards.filter(isBoardSelling),
    [sellerBoards],
  );

  const deliveryWaitingItems = useMemo(
    () =>
      salesHistory.filter((item) => {
        if (hasSellingTag(item)) return false;
        const tradeType = getTradeTypeLabel(item);
        if (tradeType !== "택배" && tradeType !== "직거래/택배") return false;
        const tradeInfo = getTradeInfoForItem(item, tradeInfoMap);
        const shippingStatus = getShippingStatusLabel(getShippingStatusValue(item, tradeInfo));
        return shippingStatus === "배송전";
      }),
    [salesHistory, tradeInfoMap],
  );

  const completedItems = useMemo(
    () =>
      salesHistory.filter((item) => {
        if (hasSellingTag(item)) return false;
        const tradeType = getTradeTypeLabel(item);
        const tradeInfo = getTradeInfoForItem(item, tradeInfoMap);
        const shippingStatus = getShippingStatusLabel(getShippingStatusValue(item, tradeInfo));
        if (tradeType === "택배" || tradeType === "직거래/택배") {
          return shippingStatus === "배송완료";
        }
        return getSaleStatusLabel(item.status) === "판매완료";
      }),
    [salesHistory, tradeInfoMap],
  );

  const sellingPageCount = Math.max(1, Math.ceil(sellingItems.length / PAGE_SIZE));
  const deliveryWaitingPageCount = Math.max(1, Math.ceil(deliveryWaitingItems.length / PAGE_SIZE));
  const completedPageCount = Math.max(1, Math.ceil(completedItems.length / PAGE_SIZE));

  const visibleSellingItems = sellingItems.slice((sellingPage - 1) * PAGE_SIZE, sellingPage * PAGE_SIZE);
  const visibleDeliveryWaitingItems = deliveryWaitingItems.slice((deliveryWaitingPage - 1) * PAGE_SIZE, deliveryWaitingPage * PAGE_SIZE);
  const visibleCompletedItems = completedItems.slice((completedPage - 1) * PAGE_SIZE, completedPage * PAGE_SIZE);

  useEffect(() => {
    if (sellingPage > sellingPageCount) setSellingPage(sellingPageCount);
  }, [sellingPage, sellingPageCount]);

  useEffect(() => {
    if (deliveryWaitingPage > deliveryWaitingPageCount) setDeliveryWaitingPage(deliveryWaitingPageCount);
  }, [deliveryWaitingPage, deliveryWaitingPageCount]);

  useEffect(() => {
    if (completedPage > completedPageCount) setCompletedPage(completedPageCount);
  }, [completedPage, completedPageCount]);

  const renderPagination = (page, pageCount, onChange) => (
    <div className={styles.pagination}>
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>
        이전
      </button>
      <div className={styles.page_button_group}>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={pageNumber === page ? styles.page_button_active : styles.page_button}
            onClick={() => onChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button type="button" disabled={page === pageCount} onClick={() => onChange(page + 1)}>
        다음
      </button>
    </div>
  );

  const renderSaleCard = (item) => {
    const marketNo = item.marketNo ?? item.id;
    const tradeInfo = marketNo ? tradeInfoMap[marketNo] : null;
    const displayShippingStatus = tradeInfo?.shippingStatus ?? item.shippingStatus;
    const displayCourierCode = tradeInfo?.courierCode ?? item.courierCode;
    const displayInvoiceNumber = tradeInfo?.invoiceNumber ?? item.invoiceNumber;
    const address = item.orderInfo?.address || item.address || "";
    const displayTradeType = resolveTradeType(item.tradeType, item.tradeTypeText, item.deliveryMethod, address);
    const hasDelivery = displayTradeType === "택배" || displayTradeType === "직거래/택배";
    const linkMarketNo = marketNo;
    const displayTitle = getItemTitle(item);
    const displayDate = item.date
      ? new Date(item.date).toLocaleDateString("ko-KR")
      : item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("ko-KR")
      : "-";
    const displayAmount = Number(item.amount ?? item.productPrice ?? 0).toLocaleString("ko-KR");
    const saleStatus = getSaleStatusLabel(item.status ?? item.productStatus);

    return (
      <Link key={`${marketNo}-${displayTitle}`} to={`/mypage/history/sale/${linkMarketNo}`} className={styles.sale_card}>
        <div className={styles.sale_card_title}>[{saleStatus}] {displayTitle}</div>
        <div className={styles.sale_card_meta}>{displayDate} · {saleStatus}</div>
        <div className={styles.sale_card_detail}>{displayAmount}원</div>
        <div className={styles.sale_card_detail}>거래방법: {displayTradeType}</div>
        {item.buyerId || item.buyerNickname ? (
          <div className={styles.sale_card_buyer}>구매자: {item.buyerNickname || item.buyerId}</div>
        ) : null}
        {hasDelivery && (
          <>
            <div className={styles.sale_card_detail}>배송 상태: {getShippingStatusLabel(displayShippingStatus)}</div>
            <div className={styles.sale_card_detail}>택배사: {getCourierLabel(displayCourierCode)}</div>
            {displayInvoiceNumber ? <div className={styles.sale_card_detail}>송장번호: {displayInvoiceNumber}</div> : null}
          </>
        )}
      </Link>
    );
  };

  return (
    <div className={styles.sale_history_wrap}>
      <h3 className={styles.sale_title}>판매내역</h3>
      <div className={styles.sale_list}>
        {salesHistory.length === 0 && <p>등록된 판매내역이 없습니다.</p>}
        {salesHistory.length > 0 && (
          <>
            <section className={styles.sale_status_section}>
              <div className={styles.status_header}>
                <h4>판매중</h4>
                <span>{sellingItems.length}건</span>
              </div>
              {sellingItems.length > 0 ? (
                <>
                  <div className={styles.status_card_list}>{visibleSellingItems.map(renderSaleCard)}</div>
                  {sellingPageCount > 1 && renderPagination(sellingPage, sellingPageCount, setSellingPage)}
                </>
              ) : (
                <p className={styles.empty_section}>판매중인 거래가 없습니다.</p>
              )}
            </section>

            <section className={styles.sale_status_section}>
              <div className={styles.status_header}>
                <h4>배송대기</h4>
                <span>{deliveryWaitingItems.length}건</span>
              </div>
              {deliveryWaitingItems.length > 0 ? (
                <>
                  <div className={styles.status_card_list}>{visibleDeliveryWaitingItems.map(renderSaleCard)}</div>
                  {deliveryWaitingPageCount > 1 && renderPagination(deliveryWaitingPage, deliveryWaitingPageCount, setDeliveryWaitingPage)}
                </>
              ) : (
                <p className={styles.empty_section}>배송대기 상태 상품 없습니다.</p>
              )}
            </section>

            <section className={styles.sale_status_section}>
              <div className={styles.status_header}>
                <h4>판매완료</h4>
                <span>{completedItems.length}건</span>
              </div>
              {completedItems.length > 0 ? (
                <>
                  <div className={styles.status_card_list}>{visibleCompletedItems.map(renderSaleCard)}</div>
                  {completedPageCount > 1 && renderPagination(completedPage, completedPageCount, setCompletedPage)}
                </>
              ) : (
                <p className={styles.empty_section}>판매완료 내역이 없습니다.</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default SaleHistory;
