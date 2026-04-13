// 1:1 문의 관리 UI - 목록 테이블 + 답변 모달
// 실제 API 호출은 AdminQnaPage.jsx에서 담당
import styles from "../../pages/admin/AdminQnaPage.module.css";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Input, TextArea } from "../ui/Form";
import Button from "../ui/Button";
import { useRef } from "react";
import Pagination from "../ui/Pagination";

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
  page,
  setPage,
  totalPage,
  imageFile,
  setPreviewImage,
  previewImage,
}) => {
  const fileRef = useRef(null); // 숨겨진 파일 input 접근용

  // 목록에서 아이콘 클릭 시 모달 열기 + 상태 초기화
  const openDetailModal = (item) => {
    setSelectedQna(item);
    setAnswer("");
    setImageFile(null);
    setIsOpen(true);
  };

  return (
    <>
      {/* 문의 목록 테이블 */}
      <section className={styles.qna_list_wrap}>
        <div className={styles.table_wrap}>
          <table className={styles.qna_table}>
            <colgroup>
              <col className={styles.col_no} />
              <col className={styles.col_title} />
              <col className={styles.col_category} />
              <col className={styles.col_writer} />
              <col className={styles.col_date} />
              <col className={styles.col_status} />
              <col className={styles.col_answer} />
            </colgroup>
            <thead>
              <tr>
                <th className={styles.col_no}>번호</th>
                <th className={styles.col_title}>제목</th>
                <th className={styles.col_category}>카테고리</th>
                <th className={styles.col_writer}>작성자</th>
                <th className={styles.col_date}>문의일</th>
                <th className={styles.col_status}>상태</th>
                <th className={styles.col_answer}>상세보기 및 답변</th>
              </tr>
            </thead>
            <tbody>
              {qnaList.length === 0 ? (
                <tr>
                  <td colSpan={6}>등록된 Qna가 없습니다.</td>
                </tr>
              ) : (
                qnaList.map((item) => (
                  <tr key={item.qnaNo}>
                    <td className={styles.col_no}>
                      <span className={styles.badge_no}>{item.qnaNo}</span>
                    </td>
                    <td className={styles.col_title}>{item.qnaTitle}</td>
                    <td className={styles.col_category}>{item.qnaCategory}</td>
                    <td className={styles.col_writer}>{item.memberId}</td>
                    <td className={styles.col_date}>{item.qnaDate}</td>
                    <td className={styles.col_status}>
                      {/* qnaStatus 0 = 미답변, 1 = 답변완료 */}
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
                    {/* 아이콘 클릭으로 상세/답변 모달 열기 - 키보드 접근성도 처리 */}
                    <td
                      className={styles.col_answer}
                      role="button"
                      tabIndex={0}
                      aria-label={`${item.qnaNo}번 문의 상세보기`}
                      onClick={() => {
                        openDetailModal(item);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openDetailModal(item);
                        }
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

      {/* 답변 모달 - 배경 클릭 시 닫힘 */}
      {isOpen && selectedQna && (
        <div className={styles.modal_overlay} onClick={() => setIsOpen(false)}>
          <div
            className={styles.modal_content}
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫힘 방지
          >
            <h3>상세보기 및 답변</h3>
            <div className={styles.modal_body}>
              {/* 왼쪽: 문의 내용 (읽기 전용) */}
              <div className={styles.qna_detail}>
                <label htmlFor="qnaTitle">문의 제목</label>
                <Input
                  className={styles.qnaTitle}
                  id="qnaTitle"
                  name="qnaTitle"
                  value={selectedQna.qnaTitle}
                  readOnly
                />
                <label htmlFor="qnaContent">문의 내용</label>
                <TextArea
                  className={styles.qnaContent}
                  id="qnaContent"
                  name="qnaContent"
                  value={selectedQna.qnaContent}
                  readOnly
                />
              </div>
              {/* 오른쪽: 질문 이미지 - 클릭 시 크게보기 */}
              <div className={styles.qna_image}>
                {selectedQna.qnaQuestionImage ? (
                  <img
                    src={`${import.meta.env.VITE_BACKSERVER}${selectedQna.qnaQuestionImage}`}
                    alt="질문 이미지"
                    onClick={() =>
                      setPreviewImage(
                        `${import.meta.env.VITE_BACKSERVER}${selectedQna.qnaQuestionImage}`,
                      )
                    }
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <div className={styles.no_image}>탄소커넥트</div>
                )}
              </div>
            </div>

            {/* 답변 작성 영역 */}
            <div className={styles.modal_answer}>
              <label htmlFor="qnaAnswer">답변 작성</label>
              <TextArea
                id="qnaAnswer"
                name="qnaAnswer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              {/* 이미지 첨부 - input 숨기고 버튼으로 클릭 트리거 */}
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
                  type="button"
                  onClick={() => fileRef.current.click()}
                >
                  이미지 첨부
                </Button>
                <span>{imageFile ? imageFile.name : "첨부된 이미지 없음"}</span>
                <div className={styles.modal_btn_right}>
                  <Button
                    className="btn admin"
                    type="button"
                    onClick={() => setIsOpen(false)}
                  >
                    취소하기
                  </Button>
                  <Button
                    className="btn admin"
                    type="button"
                    onClick={qnaAnswer}
                  >
                    답변하기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Pagination
        page={page}
        setPage={setPage}
        totalPage={totalPage}
        naviSize={5}
      />

      {/* 이미지 크게보기 모달 - 클릭하면 닫힘 */}
      {previewImage && (
        <div
          className={styles.image_modal}
          onClick={() => setPreviewImage(null)}
        >
          <img src={previewImage} alt="이미지 크게보기" />
        </div>
      )}
    </>
  );
};

export default AdminQna;
