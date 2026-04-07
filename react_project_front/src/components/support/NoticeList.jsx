import styles from "./NoticeList.module.css";

const NoticeList = ({ notices, page, totalPages, onPageChange, onBack }) => {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <button className={styles.back_btn} onClick={onBack}>
          ← 고객센터
        </button>
        <h2 className={styles.title}>공지사항</h2>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {notices.length > 0 ? (
            notices.map((n) => (
              <tr key={n.noticeNo}>
                <td>{n.noticeNo}</td>
                <td className={styles.td_title}>{n.noticeTitle}</td>
                <td>{n.createDate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className={styles.empty}>
                등록된 공지사항이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          이전
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={page === i + 1 ? styles.active : ""}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default NoticeList;
