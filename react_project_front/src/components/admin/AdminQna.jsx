import styles from "../../pages/admin/AdminQnaPage.module.css";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Input, TextArea } from "../ui/Form";
import Button from "../ui/Button";
import { useRef } from "react";

const AdminQna = ({
  qnaList,
  isOpen,
  setIsOpen,
  selectedQna,
  setSelectedQna,
  answer,
  setAnswer,
  qnaAnswer,
  setImageFile,
}) => {
  const fileRef = useRef(null);
  return (
    <>
      <section className={styles.qna_list_wrap}>
        <div className={styles.table_wrap}>
          <table className={styles.qna_table}>
            <colgroup>
              <col className={styles.col_no} />
              <col className={styles.col_title} />
              <col className={styles.col_writer} />
              <col className={styles.col_date} />
              <col className={styles.col_status} />
              <col className={styles.col_answer} />
            </colgroup>
            <thead>
              <tr>
                <th className={styles.col_no}>번호</th>
                <th className={styles.col_title}>제목</th>
                <th className={styles.col_writer}>작성자</th>
                <th className={styles.col_date}>문의일</th>
                <th className={styles.col_status}>상태</th>
                <th className={styles.col_status}>상세보기 및 답변</th>
              </tr>
            </thead>
            <tbody>
              {qnaList.length === 0 ? (
                <tr>
                  <td colSpan={5}>등록된 Qna가 없습니다.</td>
                </tr>
              ) : (
                qnaList.map((item) => (
                  <tr key={item.qnaNo}>
                    <td className={styles.col_no}>
                      <span className={styles.badge_no}>{item.qnaNo}</span>
                    </td>
                    <td className={styles.col_title}>{item.qnaTitle}</td>
                    <td className={styles.col_writer}>{item.qnaMemberId}</td>
                    <td className={styles.col_date}>{item.qnaDate}</td>
                    <td className={styles.col_status}>
                      <span
                        className={
                          item.qnaStatus === 0
                            ? styles.badge_pending
                            : styles.badge_done
                        }
                      >
                        {item.qnaStatus === 0 ? "미답변" : "답변완료"}
                      </span>
                    </td>
                    <td
                      className={styles.col_answer}
                      onClick={() => {
                        setSelectedQna(item);
                        setIsOpen(true);
                      }}
                    >
                      <OpenInNewIcon />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isOpen && selectedQna && (
        <div className={styles.modal_overlay} onClick={() => setIsOpen(false)}>
          <div
            className={styles.modal_content}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>상세보기 및 답변</h3>
            <div className={styles.modal_body}>
              <div className={styles.qna_detail}>
                <label htmlFor="qnaTitle">문의 제목</label>
                <Input
                  className={styles.qnaTitle}
                  id="qnaTitle"
                  name="qnaTitle"
                  value={selectedQna.qnaTitle}
                  readOnly="ture"
                />
                <label htmlFor="qnaContent">문의 내용</label>
                <TextArea
                  className={styles.qnaContent}
                  id="qnaContent"
                  name="qnaContent"
                  value={selectedQna.qnaContent}
                  readOnly="true"
                />
              </div>
              <div className={styles.qna_image}>질문 이미지 영역</div>
            </div>

            <div className={styles.modal_answer}>
              <label htmlFor="qnaAnswer">답변 작성</label>
              <TextArea
                name="qnaAnswer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                style={{ display: "none" }}
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <div className={styles.modal_btn}>
                <Button
                  className="btn admin sm"
                  onClick={() => fileRef.current.click()}
                >
                  이미지 첨부
                </Button>
                <div className={styles.modal_btn_right}>
                  <Button
                    className="btn admin"
                    onClick={() => setIsOpen(false)}
                  >
                    취소하기
                  </Button>
                  <Button className="btn admin" onClick={qnaAnswer}>
                    답변하기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminQna;
