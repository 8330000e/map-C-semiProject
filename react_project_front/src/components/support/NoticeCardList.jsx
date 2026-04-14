import { useNavigate } from "react-router-dom";
import { normalizeImageUrl } from "../../utils/getImageUrl";
import styles from "./NoticeCardList.module.css";

const categoryColors = {
  이벤트: "#f59e0b",
  점검: "#ef4444",
  업데이트: "#3b82f6",
  안내: "#10b981",
};

const NoticeCardList = ({ noticeList }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.card_list}>
      {noticeList.map((notice) => (
        <div
          key={notice.noticeNo}
          className={styles.card}
          onClick={() => navigate(`/support/notice/${notice.noticeNo}`)}
        >
          <span
            className={styles.category_tag}
            style={{ backgroundColor: categoryColors[notice.noticeCategory] }}
          >
            {notice.noticeCategory}
          </span>
          <div className={styles.image_box}>
            {notice.noticeImagePath ? (
              <img
                src={normalizeImageUrl(notice.noticeImagePath, "notice")}
                alt="공지 이미지"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className={styles.no_image}>탄소커넥트</div>
            )}
          </div>
          <div className={styles.text_box}>
            <div className={styles.card_title}>{notice.noticeTitle}</div>
            <div className={styles.date}>{notice.noticeDate}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoticeCardList;
