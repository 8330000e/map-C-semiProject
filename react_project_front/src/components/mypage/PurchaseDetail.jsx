import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./PurchaseHistory.module.css";

const mockPurchaseHistory = [
  {
    id: 1,
    title: "재생 우드 의자",
    date: "2026-03-22",
    amount: 75000,
    status: "구매완료",
    tradeType: 0,
    tradeTypeText: "직거래/택배",
    seller: "업사이클샵",
  },
  {
    id: 2,
    title: "중고 노트북",
    date: "2026-03-18",
    amount: 430000,
    status: "배송대기",
    tradeType: 2,
    tradeTypeText: "택배",
    seller: "노트북박사",
  },
];

const tradeTypeLabel = (type, text) => {
  if (text) return text;
  if (type === 0) return "직거래/택배";
  if (type === 1) return "직거래";
  if (type === 2) return "택배";
  return "-";
};

const PurchaseDetail = () => {
  const { id } = useParams();
  const item = mockPurchaseHistory.find((p) => String(p.id) === String(id));

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewImage, setReviewImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setReviewImage(file);
  };

  const onSubmitReview = () => {
    if (!comment.trim()) {
      alert("평가 내용을 작성해주세요.");
      return;
    }

    const newReview = {
      id: Date.now(),
      rating,
      comment,
      imageName: reviewImage ? reviewImage.name : null,
      createdAt: new Date().toLocaleString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    alert("평가가 정상적으로 제출되었습니다.");
    setRating(5);
    setComment("");
    setReviewImage(null);
  };

  const startEditing = (review) => {
    setEditReviewId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const cancelEditing = () => {
    setEditReviewId(null);
    setEditRating(5);
    setEditComment("");
  };

  const saveEdit = () => {
    if (!editComment.trim()) {
      alert("평가 내용을 작성해주세요.");
      return;
    }
    setReviews((prev) =>
      prev.map((rev) =>
        rev.id === editReviewId
          ? { ...rev, rating: editRating, comment: editComment }
          : rev,
      ),
    );
    cancelEditing();
    alert("평가가 수정되었습니다.");
  };

  const removeReview = (reviewId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setReviews((prev) => prev.filter((rev) => rev.id !== reviewId));
  };

  if (!item) {
    return (
      <div className={styles.purchase_history_wrap}>
        <p className={styles.purchase_title}>구매 상세를 찾을 수 없습니다.</p>
        <Link
          className={styles.purchase_back_link}
          to="/mypage/history/purchase"
        >
          구매내역으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.purchase_history_wrap}>
      <h3 className={styles.purchase_title}>구매 상세 ({item.title})</h3>
      <div className={styles.purchase_card}>
        <div className={styles.purchase_card_title}>{item.title}</div>
        <div className={styles.purchase_card_meta}>
          {item.date} · {item.status}
        </div>
        <div>판매자: {item.seller}</div>
        <div>금액: {item.amount.toLocaleString()}원</div>
        <div>
          거래방법: {tradeTypeLabel(item.tradeType, item.tradeTypeText)}
        </div>
      </div>

      {item.status === "구매완료" && (
        <div className={styles.review_area}>
          <h4>구매후기 작성</h4>
          <div className={styles.review_row}>
            <label>평가 점수 (1~5):</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((v) => (
                <option key={v} value={v}>
                  {v}점
                </option>
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
            <button className="btn" onClick={onSubmitReview}>
              제출하기
            </button>
            <Link className="btn" to="/mypage/history/purchase">
              뒤로가기
            </Link>
          </div>
        </div>
      )}

      {reviews.length > 0 && (
        <div className={styles.review_area}>
          <h4>작성된 후기</h4>
          {reviews.map((rev) => (
            <div key={rev.id} className={styles.purchase_card}>
              <div className={styles.purchase_card_title}>
                별점: {rev.rating}점
              </div>
              <div className={styles.purchase_card_meta}>{rev.createdAt}</div>
              {editReviewId === rev.id ? (
                <div className={styles.review_edit_wrap}>
                  <div className={styles.review_row}>
                    <label>평가 점수:</label>
                    <select
                      value={editRating}
                      onChange={(e) => setEditRating(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map((v) => (
                        <option key={v} value={v}>
                          {v}점
                        </option>
                      ))}
                    </select>
                  </div>
                  <textarea
                    className={styles.review_textarea}
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                  />
                  <div className={styles.review_actions}>
                    <button className="btn" onClick={saveEdit}>
                      저장
                    </button>
                    <button className="btn" onClick={cancelEditing}>
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p>{rev.comment}</p>
                  {rev.imageName && <p>첨부: {rev.imageName}</p>}
                  <div className={styles.review_actions}>
                    <button className="btn" onClick={() => startEditing(rev)}>
                      수정
                    </button>
                    <button
                      className="btn"
                      onClick={() => removeReview(rev.id)}
                    >
                      삭제
                    </button>
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
