import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../../../store/useAuthStore";
import styles from "./storeDetail.module.css";

const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";
const DELIVERY_FEE = 5000;

const formatPrice = (value) => `${Number(value || 0).toLocaleString("ko-KR")}원`;
const parsePriceToNumber = (value) => Number(String(value || "").replace(/[^0-9]/g, "")) || 0;
const normalizeTradeType = (tradeType) => {
  if (tradeType === 0 || tradeType === "0" || tradeType === "직거래/택배" || String(tradeType).trim() === "직거래/택배") return "직거래/택배";
  if (tradeType === 1 || tradeType === "1" || tradeType === "직거래" || String(tradeType).trim() === "직거래") return "직거래";
  if (tradeType === 2 || tradeType === "2" || tradeType === "택배" || String(tradeType).trim() === "택배") return "택배";
  return null;
};

const getTradeTypeLabel = (tradeType) => {
  const normalized = normalizeTradeType(tradeType);
  return normalized || "미정";
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
  const { memberId, memberNickname } = useAuthStore();
  const [item, setItem] = useState(null);
  const [storeList, setStoreList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [comments, setComments] = useState([]);
  const [transactionReviews, setTransactionReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newCommentPrivate, setNewCommentPrivate] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);
  const [editingTarget, setEditingTarget] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingPrivate, setEditingPrivate] = useState(false);
  const [saleStatus, setSaleStatus] = useState("판매중");
  const [deliveryMethod, setDeliveryMethod] = useState("direct");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await axios.get(`${BACKSERVER}/api/store/boards/${itemId}/read`);
        const [detailResponse, listResponse, commentsResponse] = await Promise.all([
          axios.get(`${BACKSERVER}/api/store/boards/${itemId}`),
          axios.get(`${BACKSERVER}/api/store/boards`),
          axios.get(`${BACKSERVER}/api/store/boards/${itemId}/reviews`),
        ]);
        setItem(detailResponse.data);
        setStoreList(Array.isArray(listResponse.data) ? listResponse.data : []);
        setComments(Array.isArray(commentsResponse.data) ? commentsResponse.data : []);
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
    if (!itemId) return;
    axios
      .get(`${BACKSERVER}/api/store/markets/${itemId}/ratings`)
      .then((res) => setTransactionReviews(Array.isArray(res.data) ? res.data : []))
      .catch((error) => {
        console.error("거래 후기 조회 실패", error);
        setTransactionReviews([]);
      });
  }, [itemId]);

  useEffect(() => {
    if (!item) return;
    setSaleStatus(getSaleStatusLabel(item.productStatus));
  }, [item]);

  const itemTradeSetting = useMemo(() => {
    if (!item) return { direct: true, delivery: true };
    const normalizedTradeType = normalizeTradeType(item.tradeType);
    if (normalizedTradeType === "직거래/택배") return { direct: true, delivery: true };
    if (normalizedTradeType === "직거래") return { direct: true, delivery: false };
    if (normalizedTradeType === "택배") return { direct: false, delivery: true };
    return { direct: true, delivery: true };
  }, [item]);

  const getImageUrl = (thumb) => {
    // 여기서도 thumb가 여러 모양으로 들어와요.
    // 파일명만 들어오면 /upload/ 경로로 바꿔서 보여줍니다.
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

  const formatCommentDate = (rawDate) => {
    if (!rawDate) return "방금 전";
    const date = new Date(rawDate);
    const diff = Date.now() - date.getTime();
    const minute = Math.floor(diff / 60000);
    if (minute < 1) return "방금 전";
    if (minute < 60) return `${minute}분 전`;
    const hour = Math.floor(minute / 60);
    if (hour < 24) return `${hour}시간 전`;
    const day = Math.floor(hour / 24);
    return `${day}일 전`;
  };

  const refreshComments = async () => {
    try {
      const response = await axios.get(`${BACKSERVER}/api/store/boards/${itemId}/reviews`);
      setComments(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("댓글 목록 조회 실패", error);
    }
  };

  const handleAddComment = async () => {
    if (!memberId) {
      Swal.fire({
        icon: "warning",
        title: "로그인이 필요합니다",
        text: "댓글을 작성하려면 로그인 후 이용해주세요.",
        confirmButtonText: "확인",
        confirmButtonColor: "#464d3e",
      });
      return;
    }

    const text = newComment.trim();
    if (!text) return;

    try {
      await axios.post(`${BACKSERVER}/api/store/boards/${itemId}/reviews`, {
        reviewContent: text,
        memberId,
        memberNickname,
        isPrivate: newCommentPrivate ? 1 : 0,
        parentCommentNo: replyTarget?.reviewNo || null,
      });
      setNewComment("");
      setNewCommentPrivate(false);
      setReplyTarget(null);
      await refreshComments();
    } catch (error) {
      console.error("댓글 등록 실패", error);
      Swal.fire({
        icon: "error",
        title: "댓글 등록 실패",
        text: "댓글을 등록하지 못했습니다.",
        confirmButtonColor: "#464d3e",
      });
    }
  };

  const handleDeleteComment = async (comment) => {
    if (!memberId || memberId !== comment.memberId) return;
    const result = await Swal.fire({
      icon: "warning",
      title: "댓글 삭제",
      text: "정말 이 댓글을 삭제하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#c0392b",
      cancelButtonColor: "#8c9482",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${BACKSERVER}/api/store/boards/${itemId}/reviews/${comment.reviewNo}`, {
        params: { memberId },
      });
      await refreshComments();
    } catch (error) {
      console.error("댓글 삭제 실패", error);
      Swal.fire({
        icon: "error",
        title: "삭제 실패",
        text: "댓글을 삭제하지 못했습니다.",
        confirmButtonColor: "#464d3e",
      });
    }
  };

  const startReplyToComment = (comment) => {
    if (!memberId) {
      Swal.fire({
        icon: "warning",
        title: "로그인이 필요합니다",
        text: "답글을 작성하려면 로그인 후 이용해주세요.",
        confirmButtonText: "확인",
        confirmButtonColor: "#464d3e",
      });
      return;
    }
    setReplyTarget(comment);
    setNewComment(`@${comment.memberNickname || comment.memberId} `);
    setNewCommentPrivate(false);
  };

  const cancelReply = () => {
    setReplyTarget(null);
    setNewComment("");
    setNewCommentPrivate(false);
  };

  const startEditComment = (comment) => {
    if (!memberId || memberId !== comment.memberId) return;
    setEditingTarget(comment);
    setEditingText(comment.reviewContent || "");
    setEditingPrivate(comment.isPrivate === 1);
  };

  const cancelEdit = () => {
    setEditingTarget(null);
    setEditingText("");
    setEditingPrivate(false);
  };

  const saveEditComment = async () => {
    if (!editingTarget) return;
    const text = editingText.trim();
    if (!text) return;

    try {
      await axios.put(`${BACKSERVER}/api/store/boards/${itemId}/reviews/${editingTarget.reviewNo}`, {
        reviewContent: text,
        memberId,
        memberNickname,
        isPrivate: editingPrivate ? 1 : 0,
      });
      setEditingTarget(null);
      setEditingText("");
      setEditingPrivate(false);
      await refreshComments();
    } catch (error) {
      console.error("댓글 수정 실패", error);
      Swal.fire({
        icon: "error",
        title: "댓글 수정 실패",
        text: "댓글을 수정하지 못했습니다.",
        confirmButtonColor: "#464d3e",
      });
    }
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
  const isAuthor = memberId && item?.memberId === memberId;

  const updateProductStatus = async (statusCode) => {
    try {
      await axios.patch(`${BACKSERVER}/api/store/boards/${itemId}/status`, null, {
        params: { status: statusCode, memberId },
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
    if (!isAuthor) {
      Swal.fire({ icon: "warning", title: "작성자만 상태를 변경할 수 있습니다." });
      return;
    }

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
        marketNo: item.marketNo,
        orderName: item.marketTitle,
        amount: finalAmount,
        deliveryMethod,
        baseAmount,
        deliveryFee: deliveryMethod === "delivery" ? DELIVERY_FEE : 0,
        sellerId: item.memberId,
        sellerNickname: item.memberNickname,
        tradeType: item.tradeType,
        productThumb: item.productThumb,
      },
    });
  };

  const handleEdit = () => {
    if (!isAuthor) {
      Swal.fire({ icon: "warning", title: "작성자만 수정할 수 있습니다." });
      return;
    }
    navigate("/store/register", { state: { editItem: item } });
  };

  const handleDelete = async () => {
    if (!isAuthor) {
      Swal.fire({ icon: "warning", title: "작성자만 삭제할 수 있습니다." });
      return;
    }
    const result = await Swal.fire({
      icon: "warning",
      title: "게시글 삭제",
      text: "정말 이 상품을 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#c0392b",
      cancelButtonColor: "#8c9482",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${BACKSERVER}/api/store/boards/${itemId}`, {
        params: { memberId },
      });
      await Swal.fire({
        icon: "success",
        title: "삭제 완료",
        text: "상품이 삭제되었습니다.",
        confirmButtonColor: "#464d3e",
      });
      navigate("/store");
    } catch (error) {
      console.error("상품 삭제 실패", error);
      Swal.fire({
        icon: "error",
        title: "삭제 실패",
        text: "상품을 삭제하지 못했습니다.",
        confirmButtonColor: "#464d3e",
      });
    }
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
          <div className={styles.image}>
            {(() => {
              const imageUrl = getImageUrl(item.productThumb);
              if (imageUrl) {
                return (
                  <img
                    src={imageUrl}
                    alt={item.marketTitle || "상품 이미지"}
                    className={styles.product_image}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                );
              }
              return item.productThumb || "상품 이미지";
            })()}
          </div>
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
                직거래
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

          {isAuthor ? (
            <div className={styles.action_row}>
              <button
                type="button"
                className={`${styles.statusButton} ${saleStatus === "예약중" ? styles.statusButtonActive : ""}`}
                onClick={() => handleChangeSaleStatus("예약중")}
                disabled={saleStatus === "판매완료"}
              >
                {saleStatus === "예약중" ? "판매중으로 변경" : "예약중으로 변경"}
              </button>
              <button type="button" className={styles.edit_button} onClick={handleEdit} disabled={saleStatus === "판매완료"}>
                수정
              </button>
              <button type="button" className={styles.delete_button} onClick={handleDelete} disabled={saleStatus === "판매완료"}>
                삭제
              </button>
            </div>
          ) : null}
          {saleStatus !== "판매완료" && !isAuthor && (
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
        <p>거래후기 : {transactionReviews.length}</p>
      </div>

      {saleStatus === "판매완료" && (
        <div className={styles.comment_section}>
          <h3>거래 후기</h3>
          <div className={styles.comment_list}>
            {transactionReviews.length === 0 && <p>등록된 거래 후기가 없습니다.</p>}
            {transactionReviews.map((comment) => {
              const imageUrl = getImageUrl(comment.reviewThumb);
              return (
                <div
                  key={comment.reviewNo}
                  className={styles.comment_item}
                  style={{ marginLeft: `${(comment.commentDepth || 0) * 20}px` }}
                >
                  <div className={styles.review_header}>
                    <span className={styles.review_author}>{comment.buyerNickname || comment.memberNickname || comment.buyerId || comment.memberId}</span>
                    <span className={styles.review_score}>★ {comment.rating ?? 0}점</span>
                  </div>
                  <p className={styles.comment_meta}>{formatCommentDate(comment.createdAt)}</p>
                  <p className={styles.comment_text}>{comment.reviewContent}</p>
                  {imageUrl && (
                    <div className={styles.review_image_wrap}>
                      <img
                        className={styles.review_image}
                        src={imageUrl}
                        alt="거래 후기 이미지"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.same_items_section}>
        <h3>같은 상품 더보기</h3>
        <div className={styles.same_items_wrapper}>
          {displaySame.map((same) => {
            const imageUrl = getImageUrl(same.productThumb || same.thumb);
            return (
              <Link key={same.marketNo} to={`/store/${same.marketNo}`} className={styles.same_item}>
                <div className={styles.image}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={same.marketTitle || "상품 이미지"}
                      className={styles.product_image}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    "이미지"
                  )}
                </div>
                <div className={styles.same_item_title}>{same.marketTitle}</div>
                <div className={styles.same_item_price}>{formatPrice(same.productPrice)}</div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className={styles.comment_section}>
        <h3>댓글</h3>
        <div className={styles.comment_list}>
          {comments.length === 0 && <p>등록된 댓글이 없습니다.</p>}
          {comments.map((comment) => {
            const isOwn = comment.memberId && memberId === comment.memberId;
            const isSecret = comment.isPrivate === 1;
            const displayContent = isSecret && !isOwn ? "비공개 댓글입니다." : comment.reviewContent;
            return (
              <div
                key={comment.reviewNo}
                className={styles.comment_item}
                style={{ marginLeft: `${(comment.commentDepth || 0) * 20}px` }}
              >
                <p className={styles.comment_meta}>
                  [프로필이미지] {comment.memberNickname || comment.memberId} · {formatCommentDate(comment.createdAt)}
                  {isSecret && <span className={styles.reply_badge}>비공개</span>}
                </p>

                {editingTarget && editingTarget.reviewNo === comment.reviewNo ? (
                  <div className={styles.comment_edit_wrap}>
                    <input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className={styles.comment_input}
                    />
                    <label className={styles.private_check}>
                      <input
                        type="checkbox"
                        checked={editingPrivate}
                        onChange={(e) => setEditingPrivate(e.target.checked)}
                      />
                      비공개
                    </label>
                    <button type="button" onClick={saveEditComment}>
                      저장
                    </button>
                    <button type="button" onClick={cancelEdit}>
                      취소
                    </button>
                  </div>
                ) : (
                  <p className={styles.comment_text}>{displayContent}</p>
                )}

                <div className={styles.comment_actions}>
                  <button type="button" onClick={() => startReplyToComment(comment)}>
                    답글
                  </button>
                  {isOwn && (
                    <>
                      <button type="button" onClick={() => startEditComment(comment)}>
                        수정
                      </button>
                      <button type="button" onClick={() => handleDeleteComment(comment)}>
                        삭제
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.comment_form}>
          <p className={styles.comment_meta}>
            [프로필이미지] {memberNickname || memberId || "비회원"} | 절약점수 : 00
          </p>
          {replyTarget && (
            <div className={styles.reply_form}>
              답글 대상: {replyTarget.memberNickname || replyTarget.memberId}
              <button type="button" onClick={cancelReply}>
                취소
              </button>
            </div>
          )}
          <div className={styles.comment_form_row}>
            <input
              className={styles.comment_input}
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <label className={styles.private_check}>
              <input
                type="checkbox"
                checked={newCommentPrivate}
                onChange={(e) => setNewCommentPrivate(e.target.checked)}
              />
              비공개
            </label>

            <button type="button" onClick={handleAddComment}>
              {replyTarget ? "답글 등록" : "등록"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreDetail;