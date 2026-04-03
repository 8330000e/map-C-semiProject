import styles from "../../pages/admin/AdminNoticePage.module.css";

const AdminNotice = ({
  notice,
  changeNotice,
  insertNotice,
  noticeList,
  isEdit,
  setIsEdit,

  setNotice,
}) => {
  return (
    <>
      <section className={styles.notice_write_wrap}>
        <form>
          <section className={styles.notice_input_wrap}>
            <div className={styles.notice_write_title}>
              <label htmlFor="noticeTitle">공지사항 제목</label>
              <input
                type="text"
                id="noticeTitle"
                name="noticeTitle"
                value={notice.noticeTitle}
                onChange={changeNotice}
              ></input>
            </div>
            <div className={styles.notice_write_content}>
              <label htmlFor="noticeContent">공지사항 내용</label>
              <input
                type="text"
                id="noticeContent"
                name="noticeContent"
                value={notice.noticeContent}
                onChange={changeNotice}
              ></input>
            </div>
          </section>
          <section className={styles.notice_option_wrap}>
            <div className={styles.notice_public}>
              <label htmlFor="noticePublic">공개 설정</label>
              <select
                className={styles.select}
                name="noticePublic"
                value={notice.noticePublic}
                onChange={changeNotice}
              >
                <option value={0}>비공개</option>
                <option value={1}>공개</option>
              </select>
            </div>
            <div className={styles.notice_fixed}>
              <label htmlFor="noticeFixed">고정 설정</label>
              <select
                className={styles.select}
                name="noticeFixed"
                value={notice.noticeFixed}
                onChange={changeNotice}
              >
                <option value={0}>비고정</option>
                <option value={1}>고정</option>
              </select>
            </div>
            <button type="submit" onClick={insertNotice}>
              {isEdit ? "수정하기" : "등록하기"}
            </button>
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
            {noticeList.length === 0 ? (
              <tr>
                <td>등록된 공지사항이 없습니다.</td>
              </tr>
            ) : (
              noticeList.map((item) => (
                <tr key={item.noticeNo}>
                  <td>
                    {item.noticeFixed === 1 ? (
                      <span className={styles.badge_fixed}>고정</span>
                    ) : (
                      ""
                    )}
                  </td>
                  <td>{item.noticeTitle}</td>
                  <td>{item.noticeDate}</td>
                  <td>
                    <button
                      className={styles.edit_btn}
                      onClick={() => {
                        setIsEdit(true);

                        setNotice({
                          noticeNo: item.noticeNo,
                          noticeTitle: item.noticeTitle,
                          noticeContent: item.noticeContent,
                          noticePublic: item.noticePublic,
                          noticeFixed: item.noticeFixed,
                        });
                      }}
                    >
                      수정
                    </button>
                  </td>
                  <td>
                    <button className={styles.delete_btn}>삭제</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AdminNotice;
