import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { getCompletedSaleByMarketNo } from "./orderHistoryStorage";
import styles from "./SaleHistory.module.css";
const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";

const tradeTypeLabel = (type, text) => {
  if (text) return text;
  if (type === 0 || type === "0") return "직거래/택배";
  if (type === 1 || type === "1") return "직거래";
  if (type === 2 || type === "2") return "택배";
  return "-";
};

const getSaleStatusLabel = (productStatus) => {
  if (productStatus === "예약중" || productStatus === 1 || productStatus === "1") return "예약중";
  if (productStatus === "판매완료" || productStatus === 2 || productStatus === "2") return "판매완료";
  return "판매중";
};

const getTradeInfoStatusLabel = (tradeStatus) => {
  if (tradeStatus === 0 || tradeStatus === "0") return "주문접수";
  if (tradeStatus === 1 || tradeStatus === "1") return "배송대기";
  if (tradeStatus === 2 || tradeStatus === "2") return "배송완료";
  return "-";
};

const getShippingStatusLabel = (shippingStatus) => {
  if (shippingStatus === 1 || shippingStatus === "1") return "배송완료";
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

const normalizeTradeType = (tradeType) => {
  if (tradeType === 0 || tradeType === "0" || tradeType === "직거래/택배") return "직거래/택배";
  if (tradeType === 1 || tradeType === "1" || tradeType === "직거래") return "직거래";
  if (tradeType === 2 || tradeType === "2" || tradeType === "택배") return "택배";
  return tradeType || null;
};

const SaleDetail = () => {
  const { id } = useParams();
  const { memberId } = useAuthStore();
  const [item, setItem] = useState(null);
  const [saleOrder, setSaleOrder] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [isSubmittingInvoice, setIsSubmittingInvoice] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`${BACKSERVER}/api/store/boards/${id}`)
      .then((res) => setItem(res.data))
      .catch((error) => {
        console.error("판매상세 조회 실패", error);
        setItem(null);
      });

    const fetchTradeInfo = async () => {
      try {
        const res = await axios.get(`${BACKSERVER}/api/store/markets/${id}/trade-info`);
        if (res.data) {
          setSaleOrder(res.data);
          setInvoiceNumber(res.data.invoiceNumber || "");
          return;
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error("거래 정보 조회 실패", error);
        }
      }
      if (memberId) {
        const saved = getCompletedSaleByMarketNo(id, memberId);
        if (saved) {
          setSaleOrder(saved);
          setInvoiceNumber(saved?.invoiceNumber || "");
        }
      }
    };

    fetchTradeInfo();
  }, [id, memberId]);

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
  const saleStatus = getSaleStatusLabel(item.productStatus);
  const isSeller = saleOrder?.sellerId && saleOrder.sellerId === memberId;
  const shippingStatus = saleOrder ? getShippingStatusLabel(saleOrder.shippingStatus) : "-";
  const isShippingPending = saleOrder && (saleOrder.shippingStatus === 0 || saleOrder.shippingStatus === "0");
  const isDeliveryTrade = Boolean(
    saleOrder?.tradeType === 2 ||
    saleOrder?.tradeType === "2" ||
    saleOrder?.tradeType === 0 ||
    saleOrder?.tradeType === "0" ||
    saleOrder?.tradeType === "택배" ||
    saleOrder?.tradeType === "직거래/택배" ||
    saleOrder?.tradeType === "delivery" ||
    saleOrder?.tradeType === "direct" ||
    saleOrder?.tradeTypeText?.includes("택배") ||
    saleOrder?.orderInfo?.address
  );

  return (
    <div className={styles.sale_history_wrap}>
      <h3 className={styles.sale_title}>판매 상세 ([{saleStatus}] {item.marketTitle})</h3>
      <div className={styles.sale_card}>
        <div className={styles.sale_card_title}>[{saleStatus}] {item.marketTitle}</div>
        <div className={styles.sale_card_meta}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("ko-KR") : "-"} · {saleStatus}</div>
        <div>금액: {Number(item.productPrice || 0).toLocaleString("ko-KR")}원</div>
        <div>거래방법: {tradeTypeLabel(item.tradeType, item.tradeTypeText)}</div>
      </div>

      {saleOrder && (
        <div className={styles.shipping_info}>
          <h4>구매자 정보 / 배송 정보</h4>
          <div>구매자: {saleOrder.buyerNickname || saleOrder.buyerName || saleOrder.buyerId}</div>
          <div>거래 상태: {shippingStatus}</div>
          <div>택배사: {getCourierLabel(saleOrder.courierCode)}</div>
          <div>연락처: {saleOrder.orderInfo?.phone || saleOrder.buyerPhone || "-"}</div>
          <div>수령인: {saleOrder.orderInfo?.receiverName || saleOrder.receiverName || "-"}</div>
          <div>주소: {saleOrder.orderInfo?.address || saleOrder.address || "-"} {saleOrder.orderInfo?.addressDetail || saleOrder.addressDetail || ""}</div>
          {saleOrder.orderInfo?.deliveryMemo ? <div>배송메모: {saleOrder.orderInfo.deliveryMemo}</div> : null}
          {saleOrder.invoiceNumber ? <div>송장번호: {saleOrder.invoiceNumber}</div> : null}

          {isSeller && isDeliveryTrade && !saleOrder.invoiceNumber && (
            <div className={styles.delivery_input_section}>
              <label>
                택배사 선택
                <select value={saleOrder.courierCode || ""} onChange={(e) => setSaleOrder((prev) => ({ ...prev, courierCode: Number(e.target.value) }))}>
                  <option value="">택배사 선택</option>
                  <option value={1}>CJ대한통운</option>
                  <option value={2}>현대택배</option>
                  <option value={3}>한진택배</option>
                  <option value={4}>로젠택배</option>
                  <option value={5}>우체국택배</option>
                </select>
              </label>
              <label>
                송장번호 입력
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="송장번호를 입력하세요"
                />
              </label>
              <button
                type="button"
                className={styles.save_invoice_button}
                disabled={!invoiceNumber.trim() || !saleOrder.courierCode || isSubmittingInvoice}
                onClick={async () => {
                  const invoice = invoiceNumber.trim();
                  if (!invoice || !saleOrder.courierCode) return;
                  setIsSubmittingInvoice(true);
                  try {
                    const path = saleOrder.tradeNo
                      ? `${BACKSERVER}/api/store/trades/${saleOrder.tradeNo}`
                      : `${BACKSERVER}/api/store/markets/${id}/trade-info`;
                    const normalizedTradeType = normalizeTradeType(
                      saleOrder.tradeType || item.tradeType || item.tradeTypeText,
                    );
                    const ctpvsggId = saleOrder.ctpvsggId || item.ctpvsggId || null;
                    if (normalizedTradeType !== "택배" && !ctpvsggId) {
                      alert("직거래/택배 거래의 경우 지역 정보(ctpvsggId)가 필요합니다.");
                      return;
                    }
                    await axios.patch(path, {
                      invoiceNumber: invoice,
                      courierCode: saleOrder.courierCode,
                      shippingStatus: 1,
                      tradeStatus: 2,
                      buyerId: saleOrder.buyerId,
                      sellerId: saleOrder.sellerId,
                      tradePrice: saleOrder.tradePrice || Number(item.productPrice || 0),
                      tradeType: normalizedTradeType,
                      ctpvsggId:
                        normalizedTradeType === "택배"
                          ? null
                          : saleOrder.ctpvsggId || item.ctpvsggId || null,
                      receiverName: saleOrder.orderInfo?.receiverName || saleOrder.receiverName,
                      buyerName: saleOrder.buyerNickname || saleOrder.buyerName || saleOrder.buyerId,
                      buyerPhone: saleOrder.orderInfo?.phone || saleOrder.buyerPhone,
                      zipCode: saleOrder.orderInfo?.zipCode || saleOrder.zipCode,
                      address: saleOrder.orderInfo?.address || saleOrder.address,
                      addressDetail: saleOrder.orderInfo?.addressDetail || saleOrder.addressDetail,
                      deliveryMemo: saleOrder.orderInfo?.deliveryMemo || saleOrder.deliveryMemo,
                    });
                    const res = await axios.get(`${BACKSERVER}/api/store/markets/${id}/trade-info`);
                    setSaleOrder(res.data);
                    setInvoiceNumber(res.data.invoiceNumber || "");
                  } catch (error) {
                    console.error("송장번호 저장 실패", error);
                    alert(error.response?.data || "송장번호 저장에 실패했습니다. 다시 시도해주세요.");
                  } finally {
                    setIsSubmittingInvoice(false);
                  }
                }}
              >
                배송완료 처리
              </button>
            </div>
          )}
        </div>
      )}

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
