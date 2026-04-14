import { useNavigate } from "react-router-dom";
import styles from "./SupportNoticeDetail.module.css";
import NoticeCardList from "./NoticeCardList";
import { normalizeImageUrl } from "../../utils/getImageUrl";

const categoryColors = {
  이벤트: "#f59e0b",
  점검: "#ef4444",
  업데이트: "#3b82f6",
  안내: "#10b981",
};

const SupportNoticeDetail = ({ notice, noticeList }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrap}>
      {/* 상세 영역 */}
      <div className={styles.detail}>
        <div className={styles.header}>
          <span
            className={styles.category}
            style={{ backgroundColor: categoryColors[notice.noticeCategory] }}
          >
            {notice.noticeCategory}
          </span>
          <h2 className={styles.title}>{notice.noticeTitle}</h2>
          <div className={styles.meta}>
            <span>{notice.noticeDate}</span>
            <span>조회 {notice.noticeView}</span>
          </div>
        </div>

        {notice.noticeImagePath && (
          <div className={styles.image_box}>
            {/*
              공지 상세 이미지도 lazy loading을 적용함.
              초기 페이지 렌더링 성능을 높이고 트래픽을 줄임.
            */}
            <img
              src={normalizeImageUrl(notice.noticeImagePath)}
              alt="공지 이미지"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}

        <div className={styles.content}>{notice.noticeContent}</div>

        <div className={styles.btn_wrap}>
          <button
            className={styles.back_btn}
            onClick={() => navigate("/support/notice")}
          >
            목록으로
          </button>
        </div>
      </div>

      {/* 다른 공지사항 */}
      <div className={styles.other}>
        <h3 className={styles.other_title}>다른 공지사항</h3>
        <NoticeCardList noticeList={noticeList} />
      </div>
    </div>
  );
};

export default SupportNoticeDetail;
