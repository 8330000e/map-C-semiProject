import axios from "axios";
import { useEffect, useRef } from "react";
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
  selectedBoard,
  setSelectedBoard,
  setBoardList,
  startEdit,
  deleteBoard,
  getImageUrl,
}) => {
  const itemRefs = useRef({});

  const getBoardNo = (board) =>
    board?.boardNo ?? board?.boardId ?? board?.id ?? null;

  const normalizeId = (id) => (id !== null && id !== undefined ? String(id) : "");

  useEffect(() => {
    if (!expandedBoardNo) return;
    const item = itemRefs.current[normalizeId(expandedBoardNo)];
    if (!item) return;
    item.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [expandedBoardNo]);

  const handleBoardClick = async (board) => {
    const boardNo = getBoardNo(board);
    if (!boardNo) {
      console.warn("boardNo is undefined, skipping read count update.", board);
      return;
    }

    const isExpanded = normalizeId(expandedBoardNo) === normalizeId(boardNo);
    if (!isExpanded) {
      try {
        // 게시글 목록에서 게시글을 처음 클릭했을 때 조회수를 올리는 요청을 보냄.
        // 이미 펼쳐진 게시글을 다시 클릭하면 조회수를 다시 올리지 않도록 함.
        await axios.get(`${BACKSERVER}/boards/${boardNo}/read`);
        setBoardList((prev) =>
          prev.map((item) => {
            const itemBoardNo = getBoardNo(item);
            return itemBoardNo === boardNo
              ? { ...item, readCount: (item.readCount ?? 0) + 1 }
              : item;
          }),
        );
      } catch (err) {
        console.error("조회수 증가 실패", err);
      }
    }

    setExpandedBoardNo(isExpanded ? null : boardNo);
    setSelectedBoard(isExpanded ? null : board);
  };

  return (
    <div className={styles.boardListBox}>
      {boardList.length > 0 ? (
        <ul className={styles.boardListItems}>
          {boardList
            .filter((board) => getBoardNo(board) !== null)
            .map((board, index) => {
              const boardNo = getBoardNo(board);
              const isExpanded = normalizeId(expandedBoardNo) === normalizeId(boardNo);
              return (
                <li
                  ref={(el) => {
                    if (el) {
                      itemRefs.current[normalizeId(boardNo)] = el;
                    }
                  }}
                  className={styles.boardListItem}
                  key={boardNo}
                >
                <div
                  className={styles.boardItem}
                  onClick={() => handleBoardClick(board)}
                >
                  <div className={styles.boardItemTop}>
                    <div className={styles.boardWriter}>
                      <span className={styles.writerIcon}>👤</span>
                      <span>{board.writerNickname || board.memberNickname || board.writerId || board.memberId}</span>
                    </div>
                    <div className={styles.boardDate}>{board.createDate || board.boardDate}</div>
                  </div>
                  <div className={styles.boardTitleWrap}>
                    <div className={styles.boardTitle}>{board.boardTitle || board.BOARD_TITLE || board.title || "제목 없음"}</div>
                    {(board.updatedAt || board.updateAt) &&
                      (board.updatedAt !== board.createDate) && (
                        // 게시글 생성일과 수정일이 다르면 수정된 글로 판단해서 배지를 보여줌.
                        <span className={styles.boardUpdatedBadge}>수정됨</span>
                      )}
                  </div>
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
                      board={selectedBoard?.boardNo === board.boardNo ? selectedBoard : board}
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
