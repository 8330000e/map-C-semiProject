import styles from "./SupportNotice.module.css";

const SupportNotice = ({ noticeList, setCategory, category }) => {
  const categories = ["전체", "이벤트", "점검", "업데이트", "안내"];
  return (
    <div className={styles.wrap}>
      {/* 타이틀 */}
      <div className={styles.title_box}>
        <h2 className={styles.title}>공지사항</h2>
        <p className={styles.subtitle}>
          서비스 점검, 업데이트, 이벤트 소식을 확인할 수 있습니다.
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

      {/* 카드 리스트 */}
      <div className={styles.notice_list}>
        {noticeList.map((notice) => {
          return (
            <div key={notice.noticeNo} className={styles.card}>
              <span className={styles.category_tag}>
                {notice.noticeCategory}
              </span>
              {/* 이미지 */}
              <div className={styles.image_box}>
                {notice.noticeImage ? (
                  <img src={notice.noticeImage} alt="공지 이미지" />
                ) : (
                  <div className={styles.no_image}>탄소커넥트</div>
                )}
              </div>

              {/* 텍스트 */}
              <div className={styles.text_box}>
                <div className={styles.notice_title}>{notice.noticeTitle}</div>

                <div className={styles.notice_date}>{notice.noticeDate}</div>

                <div className={styles.notice_view}>{notice.noticeView}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SupportNotice;
