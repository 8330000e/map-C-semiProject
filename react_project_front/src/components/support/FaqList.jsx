import { useState } from "react";
import styles from "./FaqList.module.css";

const categories = ["전체", "계정", "서비스", "탄소", "기타"];

const FaqList = ({ faqs, category, onCategoryChange, onBack }) => {
  const [openId, setOpenId] = useState(null);

  const handleToggle = (faqNo) => {
    setOpenId(openId === faqNo ? null : faqNo);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <button className={styles.back_btn} onClick={onBack}>
          ← 고객센터
        </button>
        <h2 className={styles.title}>자주 묻는 질문</h2>
      </div>

      <div className={styles.category_wrap}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.cat_btn} ${
              category === cat ? styles.cat_active : ""
            }`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.faq_list}>
        {faqs.length > 0 ? (
          faqs.map((faq) => (
            <div key={faq.faqNo} className={styles.faq_item}>
              <div
                className={styles.question}
                onClick={() => handleToggle(faq.faqNo)}
              >
                <span className={styles.q_badge}>Q</span>
                <span className={styles.q_text}>{faq.faqQuestion}</span>
                <span className={styles.arrow}>
                  {openId === faq.faqNo ? "▲" : "▼"}
                </span>
              </div>
              {openId === faq.faqNo && (
                <div className={styles.answer}>
                  <span className={styles.a_badge}>A</span>
                  <span>{faq.faqAnswer}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className={styles.empty}>등록된 FAQ가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default FaqList;
