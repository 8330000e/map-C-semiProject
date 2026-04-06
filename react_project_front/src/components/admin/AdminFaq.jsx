import styles from "../../pages/admin/AdminFaqPage.module.css";
import Button from "../ui/Button";
import { TextArea } from "../ui/Form";
const AdminFaq = ({ faq, changeFaq, isEdit }) => {
  return (
    <>
      <section className={styles.faq_write_wrap}>
        <form>
          <section className={styles.faq_input_wrap}>
            <div className={styles.faq_write_title}>
              <label htmlFor="faqTitle">질문 제목</label>
              <input
                type="text"
                id="faqTitle"
                name="faqTitle"
                value={faq.faqTitle}
                onChange={changeFaq}
              />
            </div>
            <div className={styles.notice_write_content}>
              <label htmlFor="noticeContent">답변 내용</label>
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
              <label htmlFor="FaqPublic">카테고리</label>
              <select
                className={styles.select}
                name="faqCategory"
                value={faq.faqCategory}
                onChange={changeFaq}
              >
                <option value={0}>카테고리1</option>
                <option value={1}>카테고리2</option>
              </select>
            </div>

            <Button className="btn admin" type="submit" onClick={insertFaq}>
              {isEdit ? "수정하기" : "등록하기"}
            </Button>
          </section>
        </form>
      </section>
    </>
  );
};

export default AdminFaq;
