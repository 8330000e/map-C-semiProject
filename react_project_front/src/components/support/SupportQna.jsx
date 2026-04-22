import { useNavigate } from "react-router-dom";
import { Input, TextArea } from "../ui/Form";
import styles from "./SupportQna.module.css";

const SupportQna = ({
  setImageFile,
  activeTab,
  setActiveTab,
  qnaList,
  insertQna,
  qna,
  changeQna,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <section className={styles.page_header}>
        <h2 className={styles.title}>1:1 문의</h2>
        <p className={styles.subtitle}>
          서비스 이용 중 궁금한 점을 문의하고 답변 상태를 확인하세요.
        </p>
      </section>

      <section className={styles.page_content}>
        <div className={styles.category_btn_wrap}>
          <button
            type="button"
            className={`${styles.tab_btn} ${
              activeTab === "write" ? styles.tab_btn_active : ""
            }`}
            onClick={() => setActiveTab("write")}
          >
            문의하기
          </button>
          <button
            type="button"
            className={`${styles.tab_btn} ${
              activeTab === "list" ? styles.tab_btn_active : ""
            }`}
            onClick={() => setActiveTab("list")}
          >
            내 문의내역
          </button>
        </div>

        {activeTab === "write" && (
          <form onSubmit={insertQna} className={styles.write_form}>
            <div className={styles.input_wrap}>
              <div className={styles.qna_row}>
                <label htmlFor="qnaCategory">문의 유형</label>
                <select
                  id="qnaCategory"
                  name="qnaCategory"
                  value={qna.qnaCategory}
                  onChange={changeQna}
                >
                  <option value="회원·계정">회원·계정</option>
                  <option value="커뮤니티">커뮤니티</option>
                  <option value="중고거래">중고거래</option>
                  <option value="미션·사인업">미션·사인업</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div className={styles.qna_row}>
                <label htmlFor="qnaTitle">제목</label>
                <Input
                  type="text"
                  id="qnaTitle"
                  name="qnaTitle"
                  value={qna.qnaTitle}
                  onChange={changeQna}
                />
              </div>

              <div className={styles.qna_row}>
                <label htmlFor="qnaContent">내용</label>
                <TextArea
                  id="qnaContent"
                  name="qnaContent"
                  value={qna.qnaContent}
                  onChange={changeQna}
                />
              </div>
            </div>

            <div className={styles.question_image}>
              <label htmlFor="qnaQuestionImage">첨부파일 업로드(이미지)</label>
              <input
                type="file"
                id="qnaQuestionImage"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>

            <button type="submit" className={styles.submit_btn}>
              등록하기
            </button>
          </form>
        )}

        {activeTab === "list" && (
          <div className={styles.qna_list}>
            {qnaList.map((item) => (
              <div
                key={item.qnaNo}
                className={styles.qna_card}
                onClick={() => navigate(`/support/qna/${item.qnaNo}`)}
              >
                <div className={styles.qna_top}>
                  <div className={styles.qna_top_left}>
                    <span
                      className={`${styles.status_badge} ${
                        item.qnaStatus === 1
                          ? styles.badge_done
                          : styles.badge_wait
                      }`}
                    >
                      {item.qnaStatus === 1 ? "답변 완료" : "답변 대기"}
                    </span>
                    <span className={styles.qna_category}>
                      {item.qnaCategory}
                    </span>
                  </div>
                  <span className={styles.qna_date}>{item.qnaDate}</span>
                </div>

                <div className={styles.qna_title}>{item.qnaTitle}</div>
                <div className={styles.qna_content_preview}>
                  {item.qnaContent}
                </div>

                {item.qnaStatus === 1 && (
                  <div className={styles.qna_answer_row}>
                    <div className={styles.answer_preview}>
                      <strong>관리자 답변</strong>
                      <span>{item.qnaAnswer}</span>
                    </div>
                    <button type="button" className={styles.answer_btn}>
                      상세보기
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default SupportQna;
