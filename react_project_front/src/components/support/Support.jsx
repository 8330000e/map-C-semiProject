import { useNavigate } from "react-router-dom";
import styles from "./Support.module.css";

const Support = () => {
  const navigate = useNavigate();
  const cards = [
    {
      title: "자주 묻는 질문",
      desc: "이용자들이 자주 문의한 내용을 모아 확인할 수 있습니다.",
      btn: "전체보기",
      color: "faq",
      path: "/support/faq",
    },
    {
      title: "공지사항",
      desc: "서비스 점검, 업데이트, 이벤트 소식을 확인할 수 있습니다.",
      btn: "전체보기",
      color: "notice",
    },
    {
      title: "1:1 문의",
      desc: "개별 문의를 등록하고 처리 상태를 확인할 수 있습니다.",
      btn: "문의하기",
      color: "qna",
    },
  ];

  return (
    <div className={styles.main_wrap}>
      <div className={styles.title_box}>
        <h2 className={styles.title}>탄소커넥트 고객센터입니다.</h2>
        <p className={styles.subtitle}>
          서비스 이용 중 궁금한 점을 빠르게 확인해보세요.
        </p>
      </div>

      <div className={styles.card_wrap}>
        {cards.map((card, idx) => (
          <div key={idx} className={`${styles.card} ${styles[card.color]}`}>
            <h3 className={styles.card_title}>{card.title}</h3>
            <p className={styles.card_desc}>{card.desc}</p>
            <button
              className={`${styles.card_btn} ${styles[`btn_${card.color}`]}`}
              type="button"
              onClick={() => navigate(card.path)}
            >
              {card.btn}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;
