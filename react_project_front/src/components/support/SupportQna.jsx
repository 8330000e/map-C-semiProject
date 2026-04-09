import { useNavigate } from "react-router-dom";
import TextEditor from "../board/Community/TextEditor";
import Button from "../ui/Button";
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
        <div className={styles.title}>1:1 문의</div>
        <div className={styles.subtitle}>
          서비스 운영 및 업데이트 소식을 확인할 수 있습니다.
        </div>
      </section>
      <section className={styles.page_content}>
        <div className={styles.category_btn_wrap}>
          <button
            className={styles.question_btn}
            onClick={() => {
              setActiveTab("write");
            }}
          >
            문의하기
          </button>
          <button
            className={styles.question_list_btn}
            onClick={() => {
              setActiveTab("list");
            }}
          >
            내 문의내역
          </button>
        </div>
        {activeTab === "write" && (
          <>
            <form onSubmit={insertQna}>
              <div className={styles.input_wrap}>
                <div className={styles.qnaCategory}>
                  <label htmlFor="qnaCategory">문의 유형</label>
                  <select
                    name="qnaCategory"
                    value={qna.qnaCategory}
                    onChange={changeQna}
                  >
                    <option value="회원·계정">회원·계정</option>
                    <option value="커뮤니티">커뮤니티</option>
                    <option value="중고거래">중고거래</option>
                    <option value="미션·포인트">미션·포인트</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div className={styles.qnaTitle}>
                  <label htmlFor="qnaTitle">제목</label>
                  <Input
                    type="text"
                    id="qnaTitle"
                    name="qnaTitle"
                    value={qna.qnaTitle}
                    onChange={changeQna}
                  />
                </div>
                <div className={styles.qnaContent}>
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
                <label htmlFor="qnaQeustionImage">
                  첨부파일 업로드 (이미지)
                </label>
                <input
                  type="file"
                  id="qnaQuestionImage"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                ></input>
              </div>
              <Button type="submit" className="btn primary lg">
                등록하기
              </Button>
            </form>
          </>
        )}
        {activeTab === "list" && (
          <>
            <div className={styles.qna_list}>
              {qnaList.map((qna) => (
                <div
                  key={qna.qnaNo}
                  className={styles.qna_card}
                  onClick={() => navigate(`/support/qna/${qna.qnaNo}`)}
                >
                  {/* 1줄: 뱃지 + 카테고리 + 날짜 */}
                  <div className={styles.qna_top}>
                    <div className={styles.qna_top_left}>
                      <span
                        className={`${styles.status_badge} ${
                          qna.qnaStatus === 1
                            ? styles.badge_done
                            : styles.badge_wait
                        }`}
                      >
                        {qna.qnaStatus === 1 ? "답변 완료" : "답변 대기"}
                      </span>
                      <span className={styles.qna_category}>
                        {qna.qnaCategory}
                      </span>
                    </div>
                    <span className={styles.qna_date}>{qna.qnaDate}</span>
                  </div>

                  {/* 2줄: 제목 */}
                  <div className={styles.qna_title}>{qna.qnaTitle}</div>

                  {/* 3줄: 질문 내용 미리보기 */}
                  <div className={styles.qna_content_preview}>
                    {qna.qnaContent}
                  </div>

                  {/* 4줄: 답변 미리보기 + 답변보기 버튼 */}
                  {qna.qnaStatus === 1 && (
                    <div className={styles.qna_answer_row}>
                      <div className={styles.answer_preview}>
                        <strong>관리자 답변</strong>
                        <span>{qna.qnaAnswer}</span>
                      </div>
                      <button className={styles.answer_btn}>답변 보기</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default SupportQna;
