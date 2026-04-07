import { useState } from "react";
import styles from "./SupportFaq.module.css";

const categories = [
  "전체",
  "회원·계정",
  "커뮤니티",
  "중고거래",
  "미션·포인트",
  "기타",
];

const SupportFaq = ({ category, setCategory, faqList, openId, setOpenId }) => {
  return (
    <div className={styles.wrap}>
      {/* 타이틀 */}
      <div className={styles.title_box}>
        <h2 className={styles.title}>자주 묻는 질문</h2>
        <p className={styles.subtitle}>
          고객 문의가 많은 질문을 먼저 확인해보세요.
        </p>
      </div>

      {/* 카테고리 버튼 */}
      <div className={styles.category_wrap}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.cat_btn} ${category === cat ? styles.active : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ 리스트 */}
      <div className={styles.faq_list}>
        {faqList.map((faq) => (
          <div key={faq.faqNo} className={styles.faq_item}>
            <div
              className={styles.question}
              onClick={() => setOpenId(openId === faq.faqNo ? null : faq.faqNo)}
            >
              <span>Q. {faq.faqTitle}</span>
              <span className={styles.toggle}>
                {openId === faq.faqNo ? "−" : "+"}
              </span>
            </div>
            {openId === faq.faqNo && (
              <div className={styles.answer}>A. {faq.faqContent}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportFaq;
