import axios from "axios";
import CommunityDetail from "./CommunityDetail";
import styles from "./Community.module.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatIcon from "@mui/icons-material/Chat";
import VisibilityIcon from "@mui/icons-material/Visibility";

const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";

const BoardListBox = ({
  boardList,
  expandedBoardNo,
  setExpandedBoardNo,
  setBoardList,
  setSelectedBoard,
  startEdit,
  deleteBoard,
  getImageUrl,
}) => {
  const handleBoardClick = async (board) => {
    if (!board?.boardNo) {
      console.warn("boardNo is undefined, skipping read count update.", board);
      return;
    }

    const isExpanded = expandedBoardNo === board.boardNo;
    if (!isExpanded) {
      try {
        await axios.get(
          `${BACKSERVER}/boards/${board.boardNo}/read`,
        );
        setBoardList((prev) =>
          prev.map((item) =>
            item.boardNo === board.boardNo
              ? { ...item, readCount: (item.readCount ?? 0) + 1 }
              : item,
          ),
        );
      } catch (err) {
        console.error("조회수 증가 실패", err);
      }
    }

    setExpandedBoardNo(isExpanded ? null : board.boardNo);
  };

  return (
    <div className={styles.boardListBox}>
      {boardList.length > 0 ? (
        <ul className={styles.boardListItems}>
          {boardList.map((board, index) => {
            const isExpanded = expandedBoardNo === board.boardNo;
            return (
              <li
                className={styles.boardListItem}
                key={
                  board.boardNo ?? `${board.boardTitle}-${board.createDate}-${index}`
                }
              >
                <div
                  className={styles.boardItem}
                  onClick={() => handleBoardClick(board)}
                >
                  <div className={styles.boardItemTop}>
                    <div className={styles.boardWriter}>
                      <span className={styles.writerIcon}>👤</span>
                      <span>{board.writerNickname}</span>
                    </div>
                    <div className={styles.boardDate}>{board.createDate}</div>
                  </div>
                  <div className={styles.boardTitle}>{board.boardTitle}</div>

                  {board.thumbnailUrl && (
                    <div className={styles.boardThumbnailBox}>
                      <img
                        src={getImageUrl(board.thumbnailUrl || board.boardThumb)}
                        alt="썸네일"
                        className={styles.boardThumbnail}
                      />
                    </div>
                  )}
                  <div className={styles.boardItemBottom}>
                    <span className={styles.iconItem}>
                      <VisibilityIcon fontSize="small" />
                      <span>{board.readCount ?? 0}</span>
                    </span>
                    <span className={styles.iconItem}>
                      {board.liked ? (
                        <FavoriteIcon fontSize="small" />
                      ) : (
                        <FavoriteBorderIcon fontSize="small" />
                      )}
                      <span>{board.likeCount ?? 0}</span>
                    </span>
                    <span className={styles.iconItem}>
                      <ChatIcon fontSize="small" />
                      <span>{board.commentCount ?? 0}</span>
                    </span>
                  </div>
                  {isExpanded && (
                    <CommunityDetail
                      board={board}
                      onEdit={(boardItem) => {
                        setSelectedBoard(boardItem);
                        startEdit(boardItem);
                      }}
                      onDelete={(boardNo) => deleteBoard(boardNo)}
                      onLikeChange={(boardNo, newLikeCount, liked) => {
                        setBoardList((prev) =>
                          prev.map((item) =>
                            item.boardNo === boardNo
                              ? { ...item, likeCount: newLikeCount, liked }
                              : item,
                          ),
                        );
                      }}
                      onCommentCountChange={(boardNo, newCommentCount) => {
                        setBoardList((prev) =>
                          prev.map((item) =>
                            item.boardNo === boardNo
                              ? { ...item, commentCount: newCommentCount }
                              : item,
                          ),
                        );
                      }}
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className={styles.emptyBoard}>등록된 게시글이 없습니다.</div>
      )}
    </div>
  );
};

export default BoardListBox;
