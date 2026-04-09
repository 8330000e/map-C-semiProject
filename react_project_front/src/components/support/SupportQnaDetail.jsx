import { useNavigate } from "react-router-dom";
import styles from "./SupportQnaDetail.module.css";

const categoryColors = {
  "회원·계정": "#4a9fd5",
  커뮤니티: "#f59e0b",
  중고거래: "#10b981",
  "미션·포인트": "#8b5cf6",
  기타: "#999",
};

const SupportQnaDetail = ({ qna }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.wrap}>
      <div className={styles.detail}>
        {/* 헤더 */}
        <div className={styles.header}>
          <span
            className={styles.category}
            style={{ backgroundColor: categoryColors[qna.qnaCategory] }}
          >
            {qna.qnaCategory}
          </span>
          <h2 className={styles.title}>{qna.qnaTitle}</h2>
          <div className={styles.meta}>
            <span>접수일: {qna.qnaDate}</span>
            <span
              className={`${styles.status_badge} ${
                qna.qnaStatus === 1 ? styles.badge_done : styles.badge_wait
              }`}
            >
              {qna.qnaStatus === 1 ? "답변 완료" : "답변 대기"}
            </span>
          </div>
        </div>

        {/* 첨부 이미지 */}
        {qna.qnaQuestionImage && (
          <div className={styles.image_box}>
            <p className={styles.image_label}>첨부 이미지</p>
            <img
              src={`${import.meta.env.VITE_BACKSERVER}${qna.qnaQuestionImage}`}
              alt="질문 이미지"
            />
          </div>
        )}

        {/* 질문 내용 */}
        <div className={styles.content}>{qna.qnaContent}</div>

        {/* 관리자 답변 */}
        {qna.qnaAnswer && (
          <div className={styles.answer_box}>
            <h3 className={styles.answer_title}>관리자 답변</h3>
            <div className={styles.answer_content}>{qna.qnaAnswer}</div>
            {qna.qnaAnswerImage && (
              <div className={styles.answer_image}>
                <img
                  src={`${import.meta.env.VITE_BACKSERVER}${qna.qnaAnswerImage}`}
                  alt="답변 이미지"
                />
              </div>
            )}
          </div>
        )}

        {/* 버튼 */}
        <div className={styles.btn_wrap}>
          <button
            className={styles.back_btn}
            onClick={() => navigate("/support/qna", { state: { tab: "list" } })}
          >
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportQnaDetail;
