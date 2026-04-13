// FAQ 관리 UI - 위쪽 작성 폼 + 아래쪽 목록 테이블
// 실제 API 호출은 AdminFaqPage.jsx에서 담당
import styles from "../../pages/admin/AdminFaqPage.module.css";
import Button from "../ui/Button";
import { Input, TextArea } from "../ui/Form";

const AdminFaq = ({
  faq,
  changeFaq,
  isEdit,
  insertFaq,
  faqList,
  setIsEdit,
  setFaq,
  deleteFaq,
}) => {
  return (
    <>
      {/* FAQ 작성/수정 폼 */}
      <section className={styles.faq_write_wrap}>
        <form onSubmit={insertFaq}>
          <section className={styles.faq_input_wrap}>
            <div className={styles.faq_write_title}>
              <label htmlFor="faqTitle">질문 제목</label>
              <Input
                type="text"
                id="faqTitle"
                name="faqTitle"
                value={faq.faqTitle}
                onChange={changeFaq}
              />
            </div>
            <div className={styles.faq_write_content}>
              <label htmlFor="faqContent">답변 내용</label>
              <TextArea
                id="faqContent"
                name="faqContent"
                value={faq.faqContent}
                onChange={changeFaq}
              />
            </div>
          </section>
          {/* 오른쪽 옵션 - 카테고리 선택 + 등록/수정 버튼 */}
          <section className={styles.faq_option_wrap}>
            <div className={styles.faq_category}>
              <label htmlFor="faqCategory">카테고리</label>
              <select
                id="faqCategory"
                className={styles.select}
                name="faqCategory"
                value={faq.faqCategory}
                onChange={changeFaq}
              >
                <option value="회원·계정">회원·계정</option>
                <option value="커뮤니티">커뮤니티</option>
                <option value="중고거래">중고거래</option>
                <option value="미션·포인트">미션·포인트</option>
                <option value="기타">기타</option>
              </select>
            </div>

            {/* isEdit 상태에 따라 버튼 텍스트 변경 */}
            <Button className="btn admin" type="submit">
              {isEdit ? "수정하기" : "등록하기"}
            </Button>
          </section>
        </form>
      </section>

      {/* FAQ 목록 테이블 */}
      <section className={styles.faq_list_wrap}>
        <div className={styles.table_wrap}>
          <table className={styles.faq_table}>
            <colgroup>
              <col className={styles.col_category} />
              <col className={styles.col_title} />
              <col className={styles.col_edit} />
              <col className={styles.col_delete} />
            </colgroup>
            <thead>
              <tr>
                <th className={styles.col_category}>카테고리</th>
                <th className={styles.col_title}>제목</th>
                <th className={styles.col_edit}>수정</th>
                <th className={styles.col_delete}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {faqList.length === 0 ? (
                <tr>
                  <td colSpan={4}>등록된 Faq가 없습니다.</td>
                </tr>
              ) : (
                faqList.map((item) => (
                  <tr key={item.faqNo}>
                    <td className={styles.col_category}>
                      <span className={styles.badge_category}>
                        {item.faqCategory}
                      </span>
                    </td>
                    <td className={styles.col_title}>{item.faqTitle}</td>
                    <td className={styles.col_edit}>
                      {/* 수정 클릭 시 해당 FAQ 데이터 폼에 채우고 수정 모드 전환 */}
                      <Button
                        className="btn admin sm"
                        type="button"
                        onClick={() => {
                          setIsEdit(true);
                          setFaq({
                            faqNo: item.faqNo,
                            faqTitle: item.faqTitle,
                            faqContent: item.faqContent,
                            faqCategory: item.faqCategory,
                          });
                        }}
                      >
                        수정
                      </Button>
                    </td>
                    <td className={styles.col_delete}>
                      <Button
                        className="btn danger sm"
                        type="button"
                        disabled={typeof deleteFaq !== "function"}
                        onClick={() => {
                          if (typeof deleteFaq === "function") {
                            deleteFaq(item.faqNo);
                          }
                        }}
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default AdminFaq;
