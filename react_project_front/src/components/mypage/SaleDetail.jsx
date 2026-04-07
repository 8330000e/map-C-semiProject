import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { getCompletedSaleByMarketNo, removeCompletedPurchaseByMarketNo } from "./orderHistoryStorage";
import styles from "./SaleHistory.module.css";
const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";

const tradeTypeLabel = (type, text, deliveryMethod, address) => {
  const normalized = String(type ?? text ?? deliveryMethod ?? "").trim();
  const hasAddress = Boolean((address ?? "").toString().trim());
  if (normalized === "0" || normalized === "직거래/택배") return hasAddress ? "택배" : "직거래";
  if (normalized === "1" || normalized === "직거래" || normalized === "direct") return "직거래";
  if (normalized === "2" || normalized === "택배" || normalized === "delivery") return "택배";
  return hasAddress ? "택배" : "직거래";
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
  const navigate = useNavigate();
  const { memberId } = useAuthStore();
  const [item, setItem] = useState(null);
  const [saleOrder, setSaleOrder] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [isSubmittingInvoice, setIsSubmittingInvoice] = useState(false);
  const [isProcessingOrderAction, setIsProcessingOrderAction] = useState(false);
  const [reviews, setReviews] = useState([]);

  const handleSellerOrderAction = async () => {
    if (!item?.marketNo || !saleOrder?.sellerId) {
      alert("해당 주문을 처리할 수 없습니다.");
      return;
    }

    const actionText = "주문 취소";
    if (!window.confirm(`${actionText} 처리하면 판매중으로 돌아갑니다. 계속하시겠습니까?`)) {
      return;
    }

    setIsProcessingOrderAction(true);
    try {
      await axios.patch(`${BACKSERVER}/api/store/boards/${item.marketNo}/status`, null, {
        params: { status: 0, memberId: saleOrder.sellerId },
      });

      const payload = {
        tradeStatus: 0,
        shippingStatus: 0,
        tradeType: "직거래",
        tradeTypeText: "직거래",
        receiverName: null,
        buyerPhone: null,
        zipCode: null,
        address: null,
        addressDetail: null,
        deliveryMemo: null,
        invoiceNumber: null,
        courierCode: null,
      };

      if (saleOrder.tradeNo) {
        await axios.patch(`${BACKSERVER}/api/store/trades/${saleOrder.tradeNo}`, payload);
      } else {
        await axios.patch(`${BACKSERVER}/api/store/markets/${item.marketNo}/trade-info`, payload);
      }

      removeCompletedPurchaseByMarketNo(item.marketNo);
      alert(`${actionText} 처리되었습니다.`);
      navigate("/mypage/history/sale");
    } catch (error) {
      console.error(`${actionText} 실패`, error);
      alert(error.response?.data || `${actionText} 처리에 실패했습니다.`);
    } finally {
      setIsProcessingOrderAction(false);
    }
  };

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
          setSaleOrder((prev) => ({
            ...prev,
            ...res.data,
            tradeType: res.data.tradeType ?? prev?.tradeType,
            tradeTypeText: res.data.tradeTypeText ?? prev?.tradeTypeText,
            deliveryMethod: res.data.deliveryMethod ?? prev?.deliveryMethod,
            invoiceNumber: res.data.invoiceNumber || prev?.invoiceNumber,
          }));
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
  const saleOrderAddress = saleOrder?.orderInfo?.address || saleOrder?.address || "";
  const tradeMethod = saleOrder ? tradeTypeLabel(saleOrder.tradeType, saleOrder.tradeTypeText, saleOrder.deliveryMethod, saleOrderAddress) : "-";
  const isShippingPending = saleOrder && (saleOrder.shippingStatus === 0 || saleOrder.shippingStatus === "0");
  const isDeliveryTrade = Boolean(
    saleOrder?.tradeType === 2 ||
    saleOrder?.tradeType === "2" ||
    saleOrder?.tradeType === 0 ||
    saleOrder?.tradeType === "0" ||
    saleOrder?.tradeType === "택배" ||
    saleOrder?.tradeType === "직거래/택배" ||
    saleOrder?.tradeTypeText?.includes("택배")
  );
  const showSellerCancelButton = isSeller && saleStatus === "판매완료";

  return (
    <div className={styles.sale_history_wrap}>
      <div className={styles.detail_header}>
        <h3 className={styles.sale_title}>판매 상세</h3>
        <Link className={styles.detail_back_link} to="/mypage/history/sale">
          ← 판매내역으로 돌아가기
        </Link>
      </div>
      <div className={styles.sale_card}>
        <div className={styles.sale_card_title}>[{saleStatus}] {item.marketTitle}</div>
        <div className={styles.sale_card_meta}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("ko-KR") : "-"} · {saleStatus}</div>
        <div>금액: {Number(item.productPrice || 0).toLocaleString("ko-KR")}원</div>
        <div>거래방법: {tradeTypeLabel(item.tradeType, item.tradeTypeText, item.deliveryMethod, item.orderInfo?.address || item.address)}</div>
      </div>

      {saleOrder && (
        <div className={styles.shipping_info}>
          <h4>구매자 정보 / 배송 정보</h4>
          <div>구매자: {saleOrder.buyerNickname || saleOrder.buyerName || saleOrder.buyerId}</div>
          <div>거래방법: {tradeMethod}</div>
          {isDeliveryTrade ? (
            <>
              <div>배송 상태: {shippingStatus}</div>
              <div>택배사: {getCourierLabel(saleOrder.courierCode)}</div>
              {saleOrder.invoiceNumber ? <div>송장번호: {saleOrder.invoiceNumber}</div> : null}
            </>
          ) : (
            <div>배송 정보: 직거래</div>
          )}
          <div>연락처: {saleOrder.orderInfo?.phone || saleOrder.buyerPhone || "-"}</div>
          <div>수령인: {saleOrder.orderInfo?.receiverName || saleOrder.receiverName || "-"}</div>
          <div>주소: {saleOrder.orderInfo?.address || saleOrder.address || "-"} {saleOrder.orderInfo?.addressDetail || saleOrder.addressDetail || ""}</div>
          {saleOrder.orderInfo?.deliveryMemo ? <div>배송메모: {saleOrder.orderInfo.deliveryMemo}</div> : null}

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
          {(showSellerCancelButton || (isSeller && isDeliveryTrade && !saleOrder.invoiceNumber)) && (
            <div className={styles.order_actions}>
              {showSellerCancelButton && (
                <button className="btn" disabled={isProcessingOrderAction} onClick={handleSellerOrderAction}>주문 취소하기</button>
              )}
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

    </div>
  );
};

export default SaleDetail;
