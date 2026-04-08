import styles from "../../pages/admin/AdminNoticePage.module.css";
import Button from "../ui/Button";
import { Input, TextArea } from "../ui/Form";

const AdminNotice = ({
  notice,
  changeNotice,
  insertNotice,
  noticeList,
  isEdit,
  setIsEdit,
  setNotice,
  deleteNotice,
  setImageFile,
  imageFile,
}) => {
  const toFlag = (value, defaultValue = 0) => {
    if (
      value === 1 ||
      value === "1" ||
      value === true ||
      value === "Y" ||
      value === "y" ||
      value === "공개" ||
      value === "고정"
    ) {
      return 1;
    }
    if (
      value === 0 ||
      value === "0" ||
      value === false ||
      value === "N" ||
      value === "n" ||
      value === "비공개" ||
      value === "비고정"
    ) {
      return 0;
    }
    return defaultValue;
  };

  return (
    <>
      <section className={styles.notice_write_wrap}>
        <form onSubmit={insertNotice}>
          <section className={styles.notice_input_wrap}>
            <div className={styles.notice_write_title}>
              <label htmlFor="noticeTitle">공지사항 제목</label>
              <Input
                type="text"
                id="noticeTitle"
                name="noticeTitle"
                value={notice.noticeTitle}
                onChange={changeNotice}
              />
            </div>
            <div className={styles.notice_write_content}>
              <label htmlFor="noticeContent">공지사항 내용</label>
              <TextArea
                id="noticeContent"
                name="noticeContent"
                value={notice.noticeContent}
                onChange={changeNotice}
              />
            </div>
          </section>

          <section className={styles.notice_option_wrap}>
            <div className={styles.notice_public}>
              <label htmlFor="noticePublic">공개 설정</label>
              <select
                id="noticePublic"
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
                id="noticeFixed"
                className={styles.select}
                name="noticeFixed"
                value={notice.noticeFixed}
                onChange={changeNotice}
              >
                <option value={0}>비고정</option>
                <option value={1}>고정</option>
              </select>
            </div>

            <div className={styles.notice_category}>
              <label htmlFor="noticeCategory">카테고리</label>
              <select
                id="noticeCategory"
                className={styles.select}
                name="noticeCategory"
                value={notice.noticeCategory}
                onChange={changeNotice}
              >
                <option value="이벤트">이벤트</option>
                <option value="점검">점검</option>
                <option value="업데이트">업데이트</option>
                <option value="안내">안내</option>
              </select>
            </div>

            <div className={styles.notice_image}>
              <label htmlFor="noticeImage">대표 이미지</label>
              <div className={styles.file_input_wrap}>
                <label htmlFor="noticeImage" className={styles.file_btn}>
                  파일 선택
                </label>
                <span
                  className={`${styles.file_name} ${
                    imageFile || notice.hasOldImage ? styles.file_name_active : ""
                  }`}
                >
                  {imageFile
                    ? imageFile.name
                    : notice.hasOldImage
                      ? "기존 이미지 있음"
                      : "선택된 파일 없음"}
                </span>
                <input
                  className={styles.file_input}
                  type="file"
                  id="noticeImage"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>

            <Button className="btn admin" type="submit">
              {isEdit ? "수정하기" : "등록하기"}
            </Button>
          </section>
        </form>
      </section>

      <section className={styles.notice_list_wrap}>
        <div className={styles.table_wrap}>
          <table className={styles.notice_table}>
            <colgroup>
              <col className={styles.col_fixed} />
              <col className={styles.col_title} />
              <col className={styles.col_date} />
              <col className={styles.col_edit} />
              <col className={styles.col_delete} />
            </colgroup>
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
                  <td colSpan={5}>등록된 공지사항이 없습니다.</td>
                </tr>
              ) : (
                noticeList.map((item) => (
                  <tr key={item.noticeNo}>
                    <td className={styles.col_fixed}>
                      {item.noticeFixed === 1 ? (
                        <span className={styles.badge_fixed}>고정</span>
                      ) : (
                        ""
                      )}
                    </td>
                    <td className={styles.col_title}>{item.noticeTitle}</td>
                    <td className={styles.col_date}>{item.noticeDate}</td>
                    <td className={styles.col_edit}>
                      <Button
                        className="btn admin sm"
                        type="button"
                        onClick={() => {
                          setIsEdit(true);
                          setNotice({
                            noticeNo: item.noticeNo,
                            noticeTitle: item.noticeTitle,
                            noticeContent: item.noticeContent,
                            noticePublic: toFlag(item.noticePublic, 1),
                            noticeFixed: toFlag(item.noticeFixed, 0),
                            noticeCategory: item.noticeCategory || "이벤트",
                            hasOldImage: !!(
                              item.noticeImagePath ||
                              item.noticeImage ||
                              item.noticeImageName ||
                              item.noticeFileName ||
                              item.noticeFilepath ||
                              item.noticeImg
                            ),
                          });
                          setImageFile(null);
                        }}
                      >
                        수정
                      </Button>
                    </td>
                    <td className={styles.col_delete}>
                      <Button
                        className="btn danger sm"
                        type="button"
                        onClick={() => deleteNotice(item.noticeNo)}
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default AdminNotice;
