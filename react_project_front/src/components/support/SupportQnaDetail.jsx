import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SupportQnaDetail.module.css";
import { normalizeImageUrl } from "../../utils/getImageUrl";

const categoryColors = {
  "회원·계정": "#4a9fd5",
  커뮤니티: "#f59e0b",
  중고거래: "#10b981",
  "미션·사인업": "#8b5cf6",
  기타: "#999",
};

const SupportQnaDetail = ({ qna }) => {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);

  if (!qna?.qnaNo) {
    return <div className={styles.empty}>문의 정보를 불러오는 중입니다.</div>;
  }

  return (
    <div className={styles.wrap}>
      <article className={styles.detail}>
        <header className={styles.header}>
          <div className={styles.header_top}>
            <span
              className={styles.category}
              style={{ backgroundColor: categoryColors[qna.qnaCategory] || "#999" }}
            >
              {qna.qnaCategory}
            </span>
            <span
              className={`${styles.status_badge} ${
                qna.qnaStatus === 1 ? styles.badge_done : styles.badge_wait
              }`}
            >
              {qna.qnaStatus === 1 ? "답변 완료" : "답변 대기"}
            </span>
          </div>

          <h2 className={styles.title}>{qna.qnaTitle}</h2>
          <p className={styles.meta}>접수일: {qna.qnaDate}</p>
        </header>

        <section className={styles.question_box}>
          <h3 className={styles.section_title}>문의 내용</h3>
          <p className={styles.content}>{qna.qnaContent}</p>

          {qna.qnaQuestionImage && (
            <div className={styles.image_box}>
              <p className={styles.image_label}>첨부 이미지</p>
              <img
                src={normalizeImageUrl(qna.qnaQuestionImage)}
                alt="문의 첨부 이미지"
                className={styles.preview_img}
                onClick={() => setPreviewImage(normalizeImageUrl(qna.qnaQuestionImage))}
              />
            </div>
          )}
        </section>

        {qna.qnaAnswer && (
          <section className={styles.answer_box}>
            <h3 className={styles.answer_title}>관리자 답변</h3>
            <p className={styles.answer_content}>{qna.qnaAnswer}</p>

            {qna.qnaAnswerImage && (
              <div className={styles.answer_image}>
                <img
                  src={normalizeImageUrl(qna.qnaAnswerImage)}
                  alt="답변 첨부 이미지"
                  className={styles.preview_img}
                  onClick={() => setPreviewImage(normalizeImageUrl(qna.qnaAnswerImage))}
                />
              </div>
            )}
          </section>
        )}

        <div className={styles.btn_wrap}>
          <button
            type="button"
            className={styles.back_btn}
            onClick={() => navigate("/support/qna", { state: { tab: "list" } })}
          >
            목록으로
          </button>
        </div>
      </article>

      {previewImage && (
        <div className={styles.image_modal} onClick={() => setPreviewImage(null)}>
          <img
            src={previewImage}
            alt="이미지 크게보기"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default SupportQnaDetail;
