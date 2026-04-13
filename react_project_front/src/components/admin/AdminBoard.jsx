import styles from "./AdminBoard.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import GppBadIcon from "@mui/icons-material/GppBad";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CommunityDetail from "../board/Community/CommunityDetail";

const AdminBoard = ({
  boardList,
  getBoardDetail,
  isModalOpen,
  setIsModalOpen,
  selectedBoard,
}) => {
  return (
    <>
      <section className={styles.board_wrap}>
        <table>
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
                <td>{board.boardDate}</td>
                <td>
                  {board.detectedKeyword === ""
                    ? "없음"
                    : board.detectedKeyword}
                </td>
                <td>
                  {board.detectedKeyword && board.reportCount > 0 ? (
                    <GppBadIcon />
                  ) : board.detectedKeyword || board.reportCount > 0 ? (
                    <WarningAmberIcon />
                  ) : (
                    <CheckCircleIcon />
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
