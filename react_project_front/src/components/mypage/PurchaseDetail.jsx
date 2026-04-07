import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import styles from "./PurchaseHistory.module.css";
import { getCompletedPurchaseById } from "./orderHistoryStorage";

const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";

const tradeTypeLabel = (type, text) => {
  if (text) return text;
  if (type === 0) return "직거래/택배";
  if (type === 1) return "직거래";
  if (type === 2) return "택배";
  return "-";
};

const getStatusPrefix = (status) => (status ? `[${status}] ` : "");

const PurchaseDetail = () => {
  const { id } = useParams();
  const { memberId: loginMemberId } = useAuthStore();
  const [item, setItem] = useState(() => getCompletedPurchaseById(id, loginMemberId));

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewImage, setReviewImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const myReview = useMemo(
    () => reviews.find((rev) => rev.buyerId === loginMemberId),
    [reviews, loginMemberId],
  );

  useEffect(() => {
    setItem(getCompletedPurchaseById(id, loginMemberId));
  }, [id, loginMemberId]);

  useEffect(() => {
    if (!item?.marketNo) return;
    setIsLoading(true);
    axios
      .get(`${BACKSERVER}/api/store/markets/${item.marketNo}/ratings`)
      .then((res) => setReviews(Array.isArray(res.data) ? res.data : []))
      .catch((error) => {
        console.error("구매평가 조회 실패", error);
        setReviews([]);
      })
      .finally(() => setIsLoading(false));
  }, [item?.marketNo]);

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setReviewImage(file);
  };

  const onSubmitReview = async () => {
    if (!comment.trim()) {
      alert("평가 내용을 작성해주세요.");
      return;
    }
    if (!loginMemberId) {
      alert("로그인 후 평가를 작성할 수 있습니다.");
      return;
    }
    try {
      const res = await axios.post(`${BACKSERVER}/api/store/markets/${item.marketNo}/ratings`, {
        tradeNo: item.tradeNo ?? null,
        marketNo: item.marketNo,
        sellerId: item.sellerId,
        buyerId: loginMemberId,
        buyerNickname: item.buyerNickname || loginMemberId,
        rating,
        reviewContent: comment,
        reviewThumb: reviewImage ? reviewImage.name : null,
      });
      setReviews((prev) => [res.data, ...prev.filter((rev) => rev.reviewNo !== res.data.reviewNo)]);
      alert("평가가 정상적으로 제출되었습니다.");
      setRating(5);
      setComment("");
      setReviewImage(null);
    } catch (error) {
      alert(error.response?.data || "평가 제출에 실패했습니다.");
    }
  };

  const startEditing = (review) => {
    setEditReviewId(review.reviewNo);
    setEditRating(review.rating);
    setEditComment(review.reviewContent);
  };

  const cancelEditing = () => {
    setEditReviewId(null);
    setEditRating(5);
    setEditComment("");
  };

  const saveEdit = async () => {
    if (!editComment.trim()) {
      alert("평가 내용을 작성해주세요.");
      return;
    }
    try {
      await axios.put(`${BACKSERVER}/api/store/markets/${item.marketNo}/ratings/${editReviewId}`, {
        buyerId: loginMemberId,
        buyerNickname: item.buyerNickname || loginMemberId,
        rating: editRating,
        reviewContent: editComment,
        reviewThumb: reviewImage ? reviewImage.name : myReview?.reviewThumb || null,
      });
      setReviews((prev) =>
        prev.map((rev) =>
          rev.reviewNo === editReviewId ? { ...rev, rating: editRating, reviewContent: editComment } : rev,
        ),
      );
      cancelEditing();
      alert("평가가 수정되었습니다.");
    } catch (error) {
      alert(error.response?.data || "평가 수정에 실패했습니다.");
    }
  };

  const removeReview = async (reviewId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${BACKSERVER}/api/store/markets/${item.marketNo}/ratings/${reviewId}`, {
        params: { buyerId: loginMemberId },
      });
      setReviews((prev) => prev.filter((rev) => rev.reviewNo !== reviewId));
    } catch (error) {
      alert(error.response?.data || "평가 삭제에 실패했습니다.");
    }
  };

  if (!item) {
    return (
      <div className={styles.purchase_history_wrap}>
        <p className={styles.purchase_title}>구매 상세를 찾을 수 없습니다.</p>
        <Link className={styles.purchase_back_link} to="/mypage/history/purchase">
          구매내역으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.purchase_history_wrap}>
      <h3 className={styles.purchase_title}>구매 상세 ({getStatusPrefix(item.status)}{item.title})</h3>
      <div className={styles.purchase_card}>
        <div className={styles.purchase_card_title}>{getStatusPrefix(item.status)}{item.title}</div>
        <div className={styles.purchase_card_meta}>{item.date} · {item.status}</div>
        <div>판매자: {item.seller}</div>
        <div>금액: {item.amount.toLocaleString()}원</div>
        <div>거래방법: {tradeTypeLabel(item.tradeType, item.tradeTypeText)}</div>
      </div>

      {item.status === "구매완료" && !myReview && (
        <div className={styles.review_area}>
          <h4>구매후기 작성</h4>
          <div className={styles.review_row}>
            <label>평가 점수 (1~5):</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>{v}점</option>
              ))}
            </select>
          </div>
          <div className={styles.review_row}>
            <label>평가 내용:</label>
            <textarea
              className={styles.review_textarea}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="구매 경험에 대한 평가를 작성해주세요."
            />
          </div>
          <div className={styles.review_row}>
            <label>후기 사진 첨부 (선택):</label>
            <input type="file" accept="image/*" onChange={onFileChange} />
            {reviewImage && <span>{reviewImage.name}</span>}
          </div>
          <div className={styles.review_actions}>
            <button className="btn" onClick={onSubmitReview}>제출하기</button>
            <Link className="btn" to="/mypage/history/purchase">뒤로가기</Link>
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div className={styles.review_area}>
          <h4>작성된 후기 {isLoading ? "불러오는 중..." : ""}</h4>
          {reviews.map((rev) => (
            <div key={rev.reviewNo} className={styles.purchase_card}>
              <div className={styles.purchase_card_title}>별점: {rev.rating}점</div>
              <div className={styles.purchase_card_meta}>
                {(rev.createdAt ? new Date(rev.createdAt).toLocaleString("ko-KR") : "-")}
              </div>
              {editReviewId === rev.reviewNo ? (
                <div className={styles.review_edit_wrap}>
                  <div className={styles.review_row}>
                    <label>평가 점수:</label>
                    <select value={editRating} onChange={(e) => setEditRating(Number(e.target.value))}>
                      {[1, 2, 3, 4, 5].map((v) => (
                        <option key={v} value={v}>{v}점</option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    className={styles.review_textarea}
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                  />
                  <div className={styles.review_actions}>
                    <button className="btn" onClick={saveEdit}>저장</button>
                    <button className="btn" onClick={cancelEditing}>취소</button>
                  </div>
                </div>
              ) : (
                <>
                  <p>{rev.reviewContent}</p>
                  {rev.reviewThumb && <p>첨부: {rev.reviewThumb}</p>}
                  <div className={styles.review_actions}>
                    {rev.buyerId === loginMemberId && (
                      <>
                        <button className="btn" onClick={() => startEditing(rev)}>수정</button>
                        <button className="btn" onClick={() => removeReview(rev.reviewNo)}>삭제</button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <Link className={styles.purchase_back_link} to="/mypage/history/purchase">
        ← 구매내역으로 돌아가기
      </Link>
    </div>
  );
};

export default PurchaseDetail;
