// 시스템 로그 UI 컴포넌트 - 검색/필터 바 + 로그 테이블
// 데이터/API 처리는 AdminLogPage.jsx에서 담당
import styles from "./AdminLog.module.css";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

const AdminLog = ({
  adminLogList,
  logFilter,
  changeLogFilter,
  toggleSort,
  excelDownload,
}) => {
  return (
    <>
      <section className={styles.log_wrap}>
        {/* 검색 바 - 관리자/대상 아이디/신고번호/사유 통합 키워드 */}
        <div className={styles.filter_bar}>
          <input
            type="text"
            name="keyword"
            value={logFilter.keyword}
            onChange={changeLogFilter}
            placeholder="관리자/대상ID/신고번호/사유 검색"
          />
          <button
            type="button"
            className={styles.excel_btn}
            onClick={excelDownload}
          >
            <FileDownloadOutlinedIcon style={{ fontSize: 16 }} />
            관리자 로그 Excel
          </button>
        </div>

        <table className={styles.log_table}>
          <thead>
            <tr>
              <th>로그번호</th>
              <th>관리자</th>
              <th>조치 대상</th>
              <th>처리 결과</th>
              <th className={styles.sort_th} onClick={toggleSort}>
                처리일
                <span className={styles.sort_arrow}>
                  {logFilter.sort === "desc" ? "▼" : "▲"}
                </span>
              </th>
              <th>
                <select
                  name="action"
                  value={logFilter.action}
                  onChange={changeLogFilter}
                >
                  <option value="ALL">조치유형</option>
                  <option value="회원경고">회원경고</option>
                  <option value="회원정지">회원정지</option>
                  <option value="회원영구정지">회원영구정지</option>
                  <option value="정지해제">정지해제</option>
                  <option value="게시글블라인드">게시글블라인드</option>
                  <option value="게시글삭제">게시글삭제</option>
                  <option value="댓글블라인드">댓글블라인드</option>
                  <option value="댓글삭제">댓글삭제</option>
                  <option value="조치없음">조치없음</option>
                </select>
              </th>
              <th>사유</th>
              <th>신고번호</th>
            </tr>
          </thead>
          <tbody>
            {adminLogList.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.empty_state}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              adminLogList.map((log) => (
                <tr key={log.logNo}>
                  <td>{log.logNo}</td>
                  <td>{log.adminId}</td>
                  <td>{log.logTargetId}</td>
                  <td>{log.logResult}</td>
                  <td>{log.logDate}</td>
                  <td>{log.logAction}</td>
                  <td>{log.logReason}</td>
                  <td>{log.reportNo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AdminLog;
