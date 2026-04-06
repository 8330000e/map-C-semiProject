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
const getTradeTypeLabel = (tradeType) => {
  if (tradeType === "직거래/택배" || tradeType === 0 || tradeType === "0") return "직거래/택배";
  if (tradeType === "직거래" || tradeType === 1 || tradeType === "1") return "직거래";
  if (tradeType === "택배" || tradeType === 2 || tradeType === "2") return "택배";
  return "미정";
};
const getSaleStatusLabel = (productStatus) => {
  if (productStatus === "예약중" || productStatus === 1 || productStatus === "1") return "예약중";
  if (productStatus === "판매완료" || productStatus === 2 || productStatus === "2") return "판매완료";
  return "판매중";
};
const getRegionLabel = (item) => item?.regionName || [item?.ctpvNm, item?.sggNm].filter(Boolean).join(" ") || item?.ctpvsggId || "미등록";

const StoreDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const itemId = Number(id);
  const { memberId: loginMemberId } = useAuthStore();
  const [item, setItem] = useState(null);
  const [storeList, setStoreList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [comments, setComments] = useState([]);
  const [readCount, setReadCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyPrivate, setReplyPrivate] = useState(false);
  const [saleStatus, setSaleStatus] = useState("판매중");
  const [deliveryMethod, setDeliveryMethod] = useState("direct");

  const commentTree = useMemo(() => {
    const source = Array.isArray(comments) ? comments : [];
    const roots = [];
    const childrenMap = new Map();

    source.forEach((comment) => {
      const parentId = comment.parentCommentNo;
      if (parentId === null || typeof parentId === "undefined") {
        roots.push(comment);
        return;
      }
      const siblings = childrenMap.get(parentId) || [];
      siblings.push(comment);
      childrenMap.set(parentId, siblings);
    });

    const sortByNo = (left, right) => Number(left.reviewNo || 0) - Number(right.reviewNo || 0);
    roots.sort(sortByNo);
    childrenMap.forEach((value) => value.sort(sortByNo));

    return { roots, childrenMap };
  }, [comments]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [detailResponse, listResponse, reviewResponse] = await Promise.all([
          axios.get(`${BACKSERVER}/api/store/boards/${itemId}`),
          axios.get(`${BACKSERVER}/api/store/boards`),
          axios.get(`${BACKSERVER}/api/store/boards/${itemId}/reviews`),
        ]);
        setItem(detailResponse.data);
        setStoreList(Array.isArray(listResponse.data) ? listResponse.data : []);
        setComments(Array.isArray(reviewResponse.data) ? reviewResponse.data : []);
        setLoadError("");
        // 조회수 증가 (비동기, 실패해도 무시)
        axios.get(`${BACKSERVER}/api/store/boards/${itemId}/read`)
          .then((res) => setReadCount(res.data ?? detailResponse.data?.readCount ?? 0))
          .catch(() => setReadCount(detailResponse.data?.readCount ?? 0));
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
      if (item.tradeType === "직거래/택배" || item.tradeType === 0 || item.tradeType === "0") {
        return { direct: true, delivery: true };
      }
      if (item.tradeType === "직거래" || item.tradeType === 1 || item.tradeType === "1") {
        return { direct: true, delivery: false };
      }
      if (item.tradeType === "택배" || item.tradeType === 2 || item.tradeType === "2") {
        return { direct: false, delivery: true };
      }
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

  const handleAddComment = async () => {
    const text = newComment.trim();
    if (!text) return;
    if (!loginMemberId) {
      Swal.fire({ icon: "warning", title: "로그인 필요", text: "댓글은 로그인 후 작성할 수 있습니다.", confirmButtonColor: "#464d3e" });
      return;
    }
    try {
      const res = await axios.post(`${BACKSERVER}/api/store/boards/${item.marketNo}/reviews`, {
        memberId: loginMemberId,
        memberNickname: loginMemberId,
        reviewContent: text,
        isPrivate: isPrivate ? 1 : 0,
      });
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
      setIsPrivate(false);
    } catch (error) {
      Swal.fire({ icon: "error", title: "오류", text: "댓글 등록에 실패했습니다.", confirmButtonColor: "#464d3e" });
    }
  };

  const handleReplyComment = async (parentComment) => {
    const text = replyText.trim();
    if (!text) return;
    if (!loginMemberId) {
      Swal.fire({ icon: "warning", title: "로그인 필요", text: "답글은 로그인 후 작성할 수 있습니다.", confirmButtonColor: "#464d3e" });
      return;
    }
    try {
      const res = await axios.post(`${BACKSERVER}/api/store/boards/${item.marketNo}/reviews`, {
        memberId: loginMemberId,
        memberNickname: loginMemberId,
        reviewContent: text,
        isPrivate: replyPrivate ? 1 : 0,
        parentCommentNo: parentComment.reviewNo,
      });
      setComments((prev) => [...prev, res.data]);
      setReplyTargetId(null);
      setReplyText("");
      setReplyPrivate(false);
    } catch (error) {
      Swal.fire({ icon: "error", title: "오류", text: "답글 등록에 실패했습니다.", confirmButtonColor: "#464d3e" });
    }
  };

  const handleDeleteComment = async (comment) => {
    if (comment.memberId !== loginMemberId) return;
    try {
      await axios.delete(`${BACKSERVER}/api/store/boards/${item.marketNo}/reviews/${comment.reviewNo}`, {
        params: { memberId: loginMemberId },
      });
      setComments((prev) => prev.filter((c) => c.reviewNo !== comment.reviewNo));
    } catch (error) {
      Swal.fire({ icon: "error", title: "오류", text: "댓글 삭제에 실패했습니다.", confirmButtonColor: "#464d3e" });
    }
  };

  const startEditComment = (comment) => {
    setEditingId(comment.reviewNo);
    setEditingText(comment.reviewContent);
    setReplyTargetId(null);
  };

  const startReplyComment = (comment) => {
    setReplyTargetId(comment.reviewNo);
    setReplyText("");
    setReplyPrivate(false);
    setEditingId(null);
  };

  const cancelReplyComment = () => {
    setReplyTargetId(null);
    setReplyText("");
    setReplyPrivate(false);
  };

  const saveEditComment = async () => {
    const text = editingText.trim();
    if (!text || editingId === null) return;
    const target = comments.find((c) => c.reviewNo === editingId);
    if (!target) return;
    try {
      await axios.put(`${BACKSERVER}/api/store/boards/${item.marketNo}/reviews/${editingId}`, {
        memberId: loginMemberId,
        reviewContent: text,
        isPrivate: target.isPrivate,
      });
      setComments((prev) =>
        prev.map((c) => c.reviewNo === editingId ? { ...c, reviewContent: text } : c)
      );
      setEditingId(null);
      setEditingText("");
    } catch (error) {
      Swal.fire({ icon: "error", title: "오류", text: "댓글 수정에 실패했습니다.", confirmButtonColor: "#464d3e" });
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
  const isAuthor = Boolean(loginMemberId && loginMemberId === item.memberId);
  const isSoldOut = saleStatus === "판매완료";
  const soldOutActionMessage = "판매완료된 게시물은 수정하거나 예약중으로 변경할 수 없습니다.";

  const handleChangeSaleStatus = async () => {
    if (isSoldOut) return;
    const nextStatus = saleStatus === "예약중" ? 0 : 1;
    const nextLabel = nextStatus === 0 ? "판매중" : "예약중";
    const result = await Swal.fire({
      icon: "question",
      title: "상태 변경",
      text: `게시물 상태를 [${nextLabel}](으)로 바꿀까요?`,
      showCancelButton: true,
      confirmButtonText: "네, 바꿀게요",
      cancelButtonText: "아니요",
      confirmButtonColor: "#464d3e",
      cancelButtonColor: "#8c9482",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.patch(`${BACKSERVER}/api/store/boards/${item.marketNo}/status`, null, {
        params: { status: nextStatus },
      });
      setItem((prev) => (prev ? { ...prev, productStatus: nextStatus } : prev));
      setSaleStatus(nextLabel);
      await Swal.fire({
        icon: "success",
        title: "변경 완료",
        text: `게시물 상태가 [${nextLabel}](으)로 변경됐어요.`,
        confirmButtonText: "확인",
        confirmButtonColor: "#464d3e",
      });
    } catch (error) {
      Swal.fire({ icon: "error", title: "오류", text: "상태 변경에 실패했습니다.", confirmButtonColor: "#464d3e" });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "판매글 삭제",
      text: "이 게시물을 삭제할까요? 삭제 후에는 다시 복구할 수 없어요.",
      showCancelButton: true,
      confirmButtonText: "네, 삭제할게요",
      cancelButtonText: "아니요",
      confirmButtonColor: "#c0392b",
      cancelButtonColor: "#8c9482",
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${BACKSERVER}/api/store/boards/${item.marketNo}`);
      await Swal.fire({
        icon: "success",
        title: "삭제 완료",
        text: "게시물이 삭제됐어요.",
        confirmButtonText: "확인",
        confirmButtonColor: "#464d3e",
      });
      navigate("/store");
    } catch (error) {
      Swal.fire({ icon: "error", title: "오류", text: "삭제에 실패했습니다.", confirmButtonColor: "#464d3e" });
    }
  };

  const handleEdit = () => {
    if (isSoldOut) return;
    navigate("/store/register", { state: { editItem: item } });
  };

  const handleReport = () => {
    Swal.fire({
      icon: "info",
      title: "신고 기능 준비중",
      text: "신고 접수 기능은 추후 연결될 예정입니다.",
      confirmButtonText: "확인",
      confirmButtonColor: "#464d3e",
    });
  };

  const renderCommentItem = (comment, isReply = false) => {
    const isMine = loginMemberId && comment.memberId === loginMemberId;
    const children = commentTree.childrenMap.get(comment.reviewNo) || [];
    const commentDepth = Number(comment.commentDepth || 0);
    const canReply = commentDepth < 2;

    return (
      <div key={comment.reviewNo} className={`${styles.comment_item} ${isReply ? styles.reply_item : ""}`}>
        <p className={styles.comment_meta}>
          {comment.memberNickname || comment.memberId} | {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString("ko-KR") : ""}
        </p>

        {editingId === comment.reviewNo ? (
          <div className={styles.comment_edit_wrap}>
            <input
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              className={styles.comment_input}
            />
            <button type="button" onClick={saveEditComment}>저장</button>
            <button type="button" onClick={() => setEditingId(null)}>취소</button>
          </div>
        ) : (
          <p className={styles.comment_text}>
            {isReply && <span className={styles.reply_badge}>답글</span>}
            {comment.isPrivate === 1 ? "[비공개] " : ""}
            {comment.isPrivate === 1 && !isMine ? "비공개 댓글입니다." : comment.reviewContent}
          </p>
        )}

        {editingId !== comment.reviewNo && (
          <div className={styles.comment_actions}>
            {canReply && (
              <button type="button" onClick={() => startReplyComment(comment)}>답글</button>
            )}
            {isMine && (
              <>
                <button type="button" onClick={() => startEditComment(comment)}>수정</button>
                <button type="button" onClick={() => handleDeleteComment(comment)}>삭제</button>
              </>
            )}
          </div>
        )}

        {replyTargetId === comment.reviewNo && canReply && (
          <div className={styles.reply_form}>
            <div className={styles.comment_form_row}>
              <input
                className={styles.comment_input}
                placeholder={loginMemberId ? "답글을 입력하세요..." : "로그인 후 답글 작성이 가능합니다."}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                disabled={!loginMemberId}
              />
              <label className={styles.private_check}>
                <input
                  type="checkbox"
                  checked={replyPrivate}
                  onChange={(e) => setReplyPrivate(e.target.checked)}
                  disabled={!loginMemberId}
                />
                비공개
              </label>
              <button type="button" onClick={() => handleReplyComment(comment)} disabled={!loginMemberId}>등록</button>
              <button type="button" onClick={cancelReplyComment}>취소</button>
            </div>
          </div>
        )}

        {children.length > 0 && (
          <div className={styles.reply_list}>
            {children.map((child) => renderCommentItem(child, true))}
          </div>
        )}
      </div>
    );
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
        sellerNickname: item.memberNickname || item.memberId,
        tradeType: item.tradeType,
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
          <div className={styles.region_badge}>{getRegionLabel(item)}</div>
          <p>작성자 : {item.memberId}</p>
          <p>조회수 : {readCount}</p>
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

          <div className={styles.info_box}>상품 상태 : {getSaleStatusLabel(item.productStatus)}</div>

          {isAuthor && (
            <div className={styles.action_row}>
              <button
                type="button"
                className={`${styles.statusButton} ${
                  isSoldOut ? styles.statusButtonDisabled : saleStatus === "예약중" ? styles.statusButtonReserved : styles.statusButtonAvailable
                }`}
                onClick={handleChangeSaleStatus}
                disabled={isSoldOut}
                title={isSoldOut ? soldOutActionMessage : ""}
              >
                {saleStatus === "예약중" ? "판매중 전환" : "예약중 전환"}
              </button>
              <button
                type="button"
                className={`${styles.edit_button} ${isSoldOut ? styles.editButtonDisabled : styles.editButtonEnabled}`}
                onClick={handleEdit}
                disabled={isSoldOut}
                title={isSoldOut ? soldOutActionMessage : ""}
              >
                수정
              </button>
              <button type="button" className={`${styles.delete_button} ${styles.deleteButtonOutline}`} onClick={handleDelete}>
                삭제
              </button>
            </div>
          )}
          {!isAuthor && loginMemberId && (
            <div className={styles.report_row}>
              <button type="button" className={styles.report_button} onClick={handleReport}>
                신고하기
              </button>
            </div>
          )}
          {isAuthor && isSoldOut && (
            <p className={styles.action_notice}>{soldOutActionMessage}</p>
          )}
          <div className={styles.button_group}>
            <button type="button" className={styles.cart_button} disabled={isSoldOut}>
              🛒 장바구니
            </button>
            <button
              type="button"
              className={styles.buy_button}
              onClick={handleGoToPayment}
              disabled={isSoldOut}
            >
              {isSoldOut ? "판매완료" : "구매하기"}
            </button>
          </div>
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
          {comments.length === 0 && <p className={styles.no_comment}>등록된 댓글이 없습니다.</p>}
          {commentTree.roots.map((comment) => renderCommentItem(comment))}
        </div>

        <div className={styles.comment_form}>
          <div className={styles.comment_form_row}>
            <input
              className={styles.comment_input}
              placeholder={loginMemberId ? "댓글을 입력하세요..." : "로그인 후 댓글 작성이 가능합니다."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!loginMemberId}
            />
            <label className={styles.private_check}>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                disabled={!loginMemberId}
              />
              비공개
            </label>
            <button type="button" onClick={handleAddComment} disabled={!loginMemberId}>
              등록
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreDetail;