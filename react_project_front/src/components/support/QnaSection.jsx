import { useState } from "react";
import styles from "./QnaSection.module.css";

const QnaSection = ({ form, myQnas, loading, onChange, onSubmit, onBack }) => {
  const [openId, setOpenId] = useState(null);

  const handleToggle = (qnaNo) => {
    setOpenId(openId === qnaNo ? null : qnaNo);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <button className={styles.back_btn} onClick={onBack}>
          ← 고객센터
        </button>
        <h2 className={styles.title}>1:1 문의</h2>
      </div>

      {/* ===== 문의 작성 영역 ===== */}
      <div className={styles.form_box}>
        <h3 className={styles.section_title}>문의하기</h3>
        <input
          type="text"
          name="title"
          placeholder="문의 제목을 입력해주세요"
          value={form.title}
          onChange={onChange}
          className={styles.input}
        />
        <textarea
          name="content"
          placeholder="문의 내용을 입력해주세요"
          value={form.content}
          onChange={onChange}
          className={styles.textarea}
          rows={6}
        />
        <button
          className={styles.submit_btn}
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "등록 중..." : "문의 등록"}
        </button>
      </div>

      {/* ===== 내 문의 내역 영역 ===== */}
      <div className={styles.list_box}>
        <h3 className={styles.section_title}>내 문의 내역</h3>

        {myQnas.length > 0 ? (
          <div className={styles.qna_list}>
            {myQnas.map((qna) => (
              <div key={qna.qnaNo} className={styles.qna_item}>
                <div
                  className={styles.qna_row}
                  onClick={() => handleToggle(qna.qnaNo)}
                >
                  <span className={styles.qna_title}>{qna.qnaTitle}</span>
                  <div className={styles.qna_meta}>
                    <span
                      className={`${styles.badge} ${
                        qna.qnaStatus === "답변완료"
                          ? styles.badge_done
                          : styles.badge_wait
                      }`}
                    >
                      {qna.qnaStatus}
                    </span>
                    <span className={styles.qna_date}>{qna.createDate}</span>
                  </div>
                </div>

                {openId === qna.qnaNo && (
                  <div className={styles.qna_detail}>
                    <div className={styles.detail_section}>
                      <span className={styles.detail_label}>문의 내용</span>
                      <p>{qna.qnaContent}</p>
                    </div>
                    {qna.qnaStatus === "답변완료" && qna.qnaAnswer && (
                      <div
                        className={`${styles.detail_section} ${styles.answer_section}`}
                      >
                        <span className={styles.detail_label}>답변</span>
                        <p>{qna.qnaAnswer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>등록된 문의가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default QnaSection;
