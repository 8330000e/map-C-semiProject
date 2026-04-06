import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./storeDetail.module.css";

const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";
const DELIVERY_FEE = 5000;

const formatPrice = (value) => `${Number(value || 0).toLocaleString("ko-KR")}원`;
const parsePriceToNumber = (value) => Number(String(value || "").replace(/[^0-9]/g, "")) || 0;
const getTradeTypeLabel = (tradeType) => {
  if (tradeType === 0 || tradeType === "0" || tradeType === "직거래/택배") return "직거래/택배";
  if (tradeType === 1 || tradeType === "1" || tradeType === "직거래") return "직거래";
  if (tradeType === 2 || tradeType === "2" || tradeType === "택배") return "택배";
  return "미정";
};
const getSaleStatusLabel = (productStatus) => {
  if (productStatus === "예약중" || productStatus === 1 || productStatus === "1") return "예약중";
  if (productStatus === "판매완료" || productStatus === 2 || productStatus === "2") return "판매완료";
  return "판매중";
};

const StoreDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const itemId = Number(id);
  const [item, setItem] = useState(null);
  const [storeList, setStoreList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [comments, setComments] = useState([
    { id: 1, user: "구매희망자1", text: "직거래로 확인하고 싶습니다.", date: "5분 전", isPrivate: false },
    { id: 2, user: "구매희망자2", text: "구성품 포함인가요?", date: "2분 전", isPrivate: true },
  ]);
  const [newComment, setNewComment] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [saleStatus, setSaleStatus] = useState("판매중");
  const [deliveryMethod, setDeliveryMethod] = useState("direct");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [detailResponse, listResponse] = await Promise.all([
          axios.get(`${BACKSERVER}/api/store/boards/${itemId}`),
          axios.get(`${BACKSERVER}/api/store/boards`),
        ]);
        setItem(detailResponse.data);
        setStoreList(Array.isArray(listResponse.data) ? listResponse.data : []);
        setLoadError("");
      } catch (error) {
        console.error("중고장터 상세 조회 실패", error);
        setLoadError("상품 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (Number.isNaN(itemId)) {
      setLoadError("잘못된 접근입니다.");
      setIsLoading(false);
      return;
    }

    fetchData();
  }, [itemId]);

  useEffect(() => {
    if (!item) return;
    setSaleStatus(getSaleStatusLabel(item.productStatus));
  }, [item]);

  const itemTradeSetting = useMemo(() => {
    if (!item) return { direct: true, delivery: true };
    if (typeof item.tradeType !== "undefined" && item.tradeType !== null) {
      if (item.tradeType === 0 || item.tradeType === "0") return { direct: true, delivery: true };
      if (item.tradeType === 1 || item.tradeType === "1") return { direct: true, delivery: false };
      if (item.tradeType === 2 || item.tradeType === "2") return { direct: false, delivery: true };
    }
    return { direct: true, delivery: true };
  }, [item]);

  const [supportDirect, setSupportDirect] = useState(true);
  const [supportDelivery, setSupportDelivery] = useState(true);

  useEffect(() => {
    setSupportDirect(itemTradeSetting.direct);
    setSupportDelivery(itemTradeSetting.delivery);

    if (itemTradeSetting.direct) {
      setDeliveryMethod("direct");
    } else if (itemTradeSetting.delivery) {
      setDeliveryMethod("delivery");
    } else {
      setDeliveryMethod("direct");
    }
  }, [itemTradeSetting]);

  const handleAddComment = () => {
    const text = newComment.trim();
    if (!text) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now(), user: "로그인유저", text, date: "방금 전", isPrivate },
    ]);
    setNewComment("");
    setIsPrivate(false);
  };

  const handleDeleteComment = (commentId) => setComments((prev) => prev.filter((c) => c.id !== commentId));

  const startEditComment = (comment) => {
    setEditingId(comment.id);
    setEditingText(comment.text);
  };

  const saveEditComment = () => {
    const text = editingText.trim();
    if (!text || editingId === null) return;
    setComments((prev) =>
      prev.map((comment) => (comment.id === editingId ? { ...comment, text, date: "방금 수정됨" } : comment)),
    );
    setEditingId(null);
    setEditingText("");
  };

  if (!item) {
    return (
      <section className={styles.detail_wrap}>
        <h1>중고장터</h1>
        <p>{isLoading ? "상품 정보를 불러오는 중입니다." : loadError || "해당 상품을 찾을 수 없습니다."}</p>
        <Link to="/store" className={styles.back_link}>
          ← 목록으로 돌아가기
        </Link>
      </section>
    );
  }

  const sameProducts = storeList.filter(
    (product) => product.marketTitle === item.marketTitle && product.marketNo !== item.marketNo,
  );
  const displaySame = sameProducts.length > 0 ? sameProducts.slice(0, 6) : storeList.filter((product) => product.marketNo !== item.marketNo).slice(0, 6);
  const displayTitle = `[${saleStatus}] ${item.marketTitle}`;

  const updateProductStatus = async (statusCode) => {
    try {
      await axios.patch(`${BACKSERVER}/api/store/boards/${itemId}/status`, null, {
        params: { status: statusCode },
      });
    } catch (error) {
      console.error("상품 상태 업데이트 실패", error);
      throw error;
    }
  };

  const getStatusCode = (status) => {
    if (status === "예약중") return 1;
    if (status === "판매완료") return 2;
    return 0;
  };

  const handleChangeSaleStatus = async (status) => {
    const isCancelAction = saleStatus === status;
    const nextStatus = isCancelAction ? "판매중" : status;
    const confirmText = isCancelAction
      ? `[${status}] 상태를 해제하고 [판매중]으로 변경하시겠습니까?`
      : `[${status}] 상태로 변경하시겠습니까?`;

    const result = await Swal.fire({
      icon: "question",
      title: "상태 변경",
      text: confirmText,
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      confirmButtonColor: "#464d3e",
      cancelButtonColor: "#8c9482",
    });

    if (!result.isConfirmed) return;

    try {
      await updateProductStatus(getStatusCode(nextStatus));
      setSaleStatus(nextStatus);
      setItem((prev) => ({ ...prev, productStatus: nextStatus }));

      Swal.fire({
        icon: "success",
        title: "변경 완료",
        text: `[${nextStatus}] 상태로 변경되었습니다.`,
        confirmButtonColor: "#464d3e",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "변경 실패",
        text: "상품 상태를 변경하지 못했습니다.",
        confirmButtonColor: "#464d3e",
      });
    }
  };

  const handleGoToPayment = () => {
    const baseAmount = parsePriceToNumber(item.productPrice);
    const finalAmount = deliveryMethod === "delivery" ? baseAmount + DELIVERY_FEE : baseAmount;
    navigate("/payment/order", {
      state: {
        itemId,
        orderName: item.marketTitle,
        amount: finalAmount,
        deliveryMethod,
        baseAmount,
        deliveryFee: deliveryMethod === "delivery" ? DELIVERY_FEE : 0,
      },
    });
  };

  return (
    <section className={styles.detail_wrap}>
      <div className={styles.detail_header}>
        <h1>{displayTitle}</h1>
        <Link to="/store" className={styles.back_link}>
          ← 목록으로 돌아가기
        </Link>
      </div>

      <div className={styles.detail_top}>
        <div className={styles.detail_image_box}>
          <div className={styles.image}>{item.productThumb || "상품 이미지"}</div>
        </div>

        <div className={styles.detail_summary}>
          <p className={styles.price}>{formatPrice(item.productPrice)}</p>
          <div className={styles.region_badge}>{item.regionName || item.ctpvsggId || "미등록"}</div>
          <p>작성자 : {item.memberId}</p>
          <p>조회수 : {item.readCount || 0}</p>
          <p>댓글 : {comments.length}</p>

          <p>거래방법 : {getTradeTypeLabel(item.tradeType)}</p>

          <div className={styles.delivery_box}>
            <p>거래방법 선택 :</p>
            <div className={styles.delivery_options}>
              <label
                className={
                  supportDirect ? styles.delivery_option : `${styles.delivery_option} ${styles.disabledOption}`
                }
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="direct"
                  checked={deliveryMethod === "direct"}
                  onChange={() => setDeliveryMethod("direct")}
                  disabled={!supportDirect}
                />
                직거래 (배송비 무료)
              </label>
              <label
                className={
                  supportDelivery ? styles.delivery_option : `${styles.delivery_option} ${styles.disabledOption}`
                }
              >
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="delivery"
                  checked={deliveryMethod === "delivery"}
                  onChange={() => setDeliveryMethod("delivery")}
                  disabled={!supportDelivery}
                />
                택배배송 (배송비 {DELIVERY_FEE.toLocaleString("ko-KR")}원)
              </label>
            </div>
          </div>

          <div className={styles.info_box}>상품 상태 : {item.productStatus || "미등록"}</div>

          <div className={styles.action_row}>
            <button
              type="button"
              className={`${styles.statusButton} ${saleStatus === "예약중" ? styles.statusButtonActive : ""}`}
              onClick={() => handleChangeSaleStatus("예약중")}
              disabled={saleStatus === "판매완료"}
            >
              예약중
            </button>
            <button type="button" className={styles.edit_button} disabled={saleStatus === "판매완료"}>
              수정
            </button>
            <button type="button" className={styles.delete_button} disabled={saleStatus === "판매완료"}>
              삭제
            </button>
          </div>
          {saleStatus !== "판매완료" && (
            <div className={styles.button_group}>
              <button type="button" className={styles.cart_button}>
                🛒 장바구니
              </button>
              <button type="button" className={styles.buy_button} onClick={handleGoToPayment}>
                구매하기
              </button>
            </div>
          )}
          {saleStatus === "판매완료" && (
            <div className={styles.info_box}>
              이 상품은 결제 완료 처리되어 더 이상 수정/삭제할 수 없습니다.
            </div>
          )}
        </div>
      </div>

      <div className={styles.section_box}>
        <h3>상품정보</h3>
        <p>{item.marketContent || `${item.marketTitle} 상품 상세 안내 ...`}</p>
      </div>

      <div className={styles.section_box}>
        <h3>가게 정보</h3>
        <p>상점명 : {item.memberNickname || item.memberId} 상점</p>
        <p>신뢰지수 : 624</p>
        <p>거래후기 : 1</p>
      </div>

      <div className={styles.same_items_section}>
        <h3>같은 상품 더보기</h3>
        <div className={styles.same_items_wrapper}>
          {displaySame.map((same) => (
            <Link key={same.marketNo} to={`/store/${same.marketNo}`} className={styles.same_item}>
              <div className={styles.image}>{same.productThumb || "이미지"}</div>
              <div className={styles.same_item_title}>{same.marketTitle}</div>
              <div className={styles.same_item_price}>{formatPrice(same.productPrice)}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.comment_section}>
        <h3>댓글</h3>
        <div className={styles.comment_list}>
          {comments.map((comment) => (
            <div key={comment.id} className={styles.comment_item}>
              <p className={styles.comment_meta}>
                [프로필이미지] {comment.user} | 절약점수 : 00 | {comment.date}
              </p>

              {editingId === comment.id ? (
                <div className={styles.comment_edit_wrap}>
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className={styles.comment_input}
                  />
                  <button type="button" onClick={saveEditComment}>
                    저장
                  </button>
                </div>
              ) : (
                <p className={styles.comment_text}>
                  {comment.isPrivate ? "[비공개] " : ""}
                  {comment.text}
                </p>
              )}

              <div className={styles.comment_actions}>
                <button type="button" onClick={() => startEditComment(comment)}>
                  수정
                </button>
                <button type="button" onClick={() => handleDeleteComment(comment.id)}>
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.comment_form}>
          <p className={styles.comment_meta}>[프로필이미지] 닉네임 | 절약점수 : 00</p>
          <div className={styles.comment_form_row}>
            <input
              className={styles.comment_input}
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <label className={styles.private_check}>
              <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
              비공개
            </label>

            <button type="button" onClick={handleAddComment}>
              등록
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreDetail;