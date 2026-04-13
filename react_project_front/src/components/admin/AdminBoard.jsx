import styles from "./AdminBoard.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import GppBadIcon from "@mui/icons-material/GppBad";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CommunityDetail from "../board/Community/CommunityDetail";

// 관리자 게시판 리스트 레이아웃을 조정함
// 제목, 작성일시, 신고수, 상세보기 칸 너비를 적절히 맞춤
const AdminBoard = ({
  boardList,
  getBoardDetail,
  isModalOpen,
  setIsModalOpen,
  selectedBoard,
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
        <table className={styles.board_table}>
          <thead>
            <tr>
              <th>번호</th>
              <th>작성자</th>
              <th>제목</th>
              <th>작성일시</th>
              <th>감지 키워드</th>
              <th>위험도</th>
              <th>신고수</th>
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
