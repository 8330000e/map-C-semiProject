import styles from "./AdminBoard.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import GppBadIcon from "@mui/icons-material/GppBad";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CommunityDetail from "../board/Community/CommunityDetail";

// 관리자 게시판 리스트 레이아웃을 조정함
// 제목, 작성일시, 신고수, 상세보기 칸 너비를 적절히 맞춤
const AdminBoard = ({
  boardList,
  selectedBoard,
  isModalOpen,
  setIsModalOpen,
  boardFilter,
  changeBoardFilter,
  toggleSort,
  getBoardDetail,
  boardStats,
  excelDownload,
}) => {
  // 작성일시를 날짜/시간으로 분리해서 보여줌.
  // 날짜는 위, 시간은 아래 줄로 내려서 화면이 넓어지지 않도록 처리함.
  const renderDateCell = (boardDate) => {
    if (!boardDate) return null;
    const [date, time] = String(boardDate).split(" ");
    return (
      <>
        <div className={styles.dateLine}>{date}</div>
        <div className={styles.timeLine}>{time || ""}</div>
      </>
    );
  };

  return (
    <>
      <section className={styles.board_wrap}>
        {/* 게시글 현황판 - 총 게시글/오늘 작성, 감지된 키워드 비율 스택 바 */}
        <div className={styles.board_header}>
          <h3>게시글 현황판</h3>
          <div className={styles.stat_item}>
            <span className={styles.stat_label}>총 게시글</span>
            <span className={styles.stat_value}>{boardStats.total}개</span>
          </div>
          <div className={styles.stat_item}>
            <span className={styles.stat_label}>오늘 작성</span>
            <span className={`${styles.stat_value} ${styles.value_today}`}>
              {boardStats.todayCount}개
            </span>
          </div>
          <div className={styles.stat_item}>
            <span className={`${styles.stat_dot} ${styles.dot_safe}`}></span>
            <span className={styles.stat_label}>정상</span>
            <span className={styles.stat_value}>{boardStats.safe}개</span>
          </div>
          <div className={styles.stat_item}>
            <span
              className={`${styles.stat_dot} ${styles.dot_detected}`}
            ></span>
            <span className={styles.stat_label}>키워드 감지</span>
            <span className={`${styles.stat_value} ${styles.value_detected}`}>
              {boardStats.detected}개
            </span>
          </div>
          <div className={styles.stack_bar_wrap}>
            <div className={styles.stack_bar}>
              {boardStats.safeRate > 0 && (
                <div
                  className={`${styles.stack_seg} ${styles.seg_safe}`}
                  style={{ width: `${boardStats.safeRate}%` }}
                >
                  {boardStats.safeRate.toFixed(0)}%
                </div>
              )}
              {boardStats.detectedRate > 0 && (
                <div
                  className={`${styles.stack_seg} ${styles.seg_detected}`}
                  style={{ width: `${boardStats.detectedRate}%` }}
                >
                  {boardStats.detectedRate.toFixed(0)}%
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            className={styles.excel_btn}
            onClick={excelDownload}
          >
            <FileDownloadOutlinedIcon style={{ fontSize: 16 }} />
            게시글 목록 Excel
          </button>
        </div>

        <table className={styles.board_table}>
          <thead>
            <tr>
              <th>번호</th>
              <th>작성자</th>
              <th>제목</th>
              <th className={styles.sort_th} onClick={toggleSort}>
                작성일시 {boardFilter.sort === "desc" ? "▼" : "▲"}
              </th>
              <th>
                <select
                  value={boardFilter.keyword}
                  onChange={changeBoardFilter}
                  name="keyword"
                >
                  <option value="all">감지된 키워드</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </th>
              <th>
                <select
                  value={boardFilter.risk}
                  onChange={changeBoardFilter}
                  name="risk"
                >
                  <option value="all">위험도</option>
                  <option value="low">낮음</option>
                  <option value="mid">중간</option>
                  <option value="high">높음</option>
                </select>
              </th>
              <th>
                <select
                  value={boardFilter.reportSort}
                  onChange={changeBoardFilter}
                  name="reportSort"
                >
                  <option value="all">신고수</option>
                  <option value="low">낮음</option>
                  <option value="high">높음</option>
                </select>
              </th>
              <th>상세보기</th>
            </tr>
          </thead>
          <tbody>
            {boardList.map((board) => (
              <tr key={board.boardNo}>
                <td>{board.boardNo}</td>
                <td>{board.writerId}</td>
                <td>{board.boardTitle}</td>
                {/* 작성일시는 줄 나눔을 허용해서 세로로 표시함 */}
                <td className={styles.dateCell}>
                  {renderDateCell(board.boardDate)}
                </td>
                <td>
                  {board.detectedKeyword === ""
                    ? "없음"
                    : board.detectedKeyword}
                </td>
                <td>
                  {board.detectedKeyword && board.reportCount > 0 ? (
                    <GppBadIcon className={styles.icon_high} />
                  ) : board.detectedKeyword || board.reportCount > 0 ? (
                    <WarningAmberIcon className={styles.icon_mid} />
                  ) : (
                    <CheckCircleIcon className={styles.icon_safe} />
                  )}
                </td>
                <td>{board.reportCount}</td>
                <td>
                  <OpenInNewIcon
                    onClick={() => {
                      getBoardDetail(board.boardNo);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {isModalOpen && (
        <div
          className={styles.modal_bg}
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          <div
            className={styles.modal_content}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <CommunityDetail
              board={selectedBoard}
              onEdit={null}
              onDelete={null}
              onLikeChange={null}
              onCommentCountChange={null}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminBoard;
