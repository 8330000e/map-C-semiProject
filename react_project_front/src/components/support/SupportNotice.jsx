import styles from "./SupportNotice.module.css";

const SupportNotice = ({ noticeList }) => {
  return (
    <div className={styles.wrap}>
      {/* 타이틀 */}
      <div className={styles.title_box}>
        <h2 className={styles.title}>공지사항</h2>
        <p className={styles.subtitle}>
          서비스 점검, 업데이트, 이벤트 소식을 확인할 수 있습니다.
        </p>
      </div>

      {/* 카드 리스트 */}
      <div className={styles.notice_list}>
        {noticeList.map((notice) => {
          return (
            <div key={notice.noticeNo} className={styles.card}>
              {/* 이미지 */}
              <div className={styles.image_box}>
                <img src="https://picsum.photos/300/200" alt="공지 이미지" />
              </div>

              {/* 텍스트 */}
              <div className={styles.text_box}>
                <div className={styles.title}>{notice.noticeTitle}</div>

                <div className={styles.date}>{notice.noticeDate}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SupportNotice;
