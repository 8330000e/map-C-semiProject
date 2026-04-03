import styles from "./AdminNotice.module.css";

const AdminNotice = () => {
  return (
    <>
      <section className={styles.notice_write_wrap}>
        <form>
          <section className={styles.notice_input_wrap}>
            <div className={styles.notice_write_title}>
              <label htmlFor="noticeTitle">공지사항 제목</label>
              <input type="text" id="noticeTitle" name="noticeTitle"></input>
            </div>
            <div className={styles.notice_write_content}>
              <label htmlFor="noticeContent">공지사항 내용</label>
              <input
                type="text"
                id="noticeContent"
                name="noticeContent"
              ></input>
            </div>
          </section>
          <section className={styles.notice_option_wrap}>
            <div className={styles.notice_public}>
              <label htmlFor="noticePublic">공개 설정</label>
              <select className={styles.select}>
                <option value={0}>비공개</option>
                <option value={1}>공개</option>
              </select>
            </div>
            <div className={styles.notice_fixed}>
              <label htmlFor="noticeFixed">고정 설정</label>
              <select className={styles.select}>
                <option value={0}>비고정</option>
                <option value={1}>고정</option>
              </select>
            </div>
            <button type="submit">등록하기</button>
          </section>
        </form>
      </section>
      <section className={styles.notice_list_wrap}>
        <table className={styles.notice_table}>
          <thead>
            <tr>
              <th className={styles.col_fixed}>고정</th>
              <th className={styles.col_title}>제목</th>
              <th className={styles.col_date}>작성일시</th>
              <th className={styles.col_edit}>수정</th>
              <th className={styles.col_delete}>삭제</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className={styles.badge_fixed}>공지</span>
              </td>
              <td>공지사항 제목 111111111111111</td>
              <td>2026-03-31 16:48:03</td>
              <td>
                <button className={styles.edit_btn}>수정</button>
              </td>
              <td>
                <button className={styles.delete_btn}>삭제</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AdminNotice;
