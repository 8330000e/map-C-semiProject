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
                <option value={0}>카테고리1</option>
                <option value={1}>카테고리2</option>
              </select>
            </div>

            <Button className="btn admin" type="submit">
              {isEdit ? "수정하기" : "등록하기"}
            </Button>
          </section>
        </form>
      </section>
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
                      {Number(item.faqCategory) === 0 ? (
                        <span className={styles.badge_category}>카테고리1</span>
                      ) : (
                        <span className={styles.badge_category}>카테고리2</span>
                      )}
                    </td>
                    <td className={styles.col_title}>{item.faqTitle}</td>

                    <td className={styles.col_edit}>
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
