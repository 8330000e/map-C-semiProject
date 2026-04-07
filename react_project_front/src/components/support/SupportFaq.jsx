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

const dummyFaqs = [
  {
    faqNo: 1,
    faqTitle: "비밀번호를 잊어버렸어요.",
    faqContent: "로그인 화면의 비밀번호 찾기 기능을 통해 재설정할 수 있습니다.",
    faqCategory: "회원·계정",
  },
  {
    faqNo: 2,
    faqTitle: "게시글 신고는 어디서 하나요?",
    faqContent: "게시글 상세 페이지 우측 상단의 신고 버튼을 눌러주세요.",
    faqCategory: "커뮤니티",
  },
  {
    faqNo: 3,
    faqTitle: "회원 상태가 정지되면 어떻게 되나요?",
    faqContent: "정지 기간 동안 게시글 작성 및 댓글이 제한됩니다.",
    faqCategory: "회원·계정",
  },
  {
    faqNo: 4,
    faqTitle: "활동 데이터는 어디서 확인할 수 있나요?",
    faqContent: "마이페이지에서 활동 내역을 확인할 수 있습니다.",
    faqCategory: "미션·포인트",
  },
];

const SupportFaq = () => {
  const [activeCategory, setActiveCategory] = useState("전체");
  const [openId, setOpenId] = useState(null);

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
            className={`${styles.cat_btn} ${activeCategory === cat ? styles.active : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ 리스트 */}
      <div className={styles.faq_list}>
        {dummyFaqs.map((faq) => (
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
