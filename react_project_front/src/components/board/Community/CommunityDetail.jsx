import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import useAuthStore from "../../../store/useAuthStore";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import FlagIcon from "@mui/icons-material/Flag";
import styles from "./Community.module.css";
import Swal from "sweetalert2";

const formatTime = (rawDate) => {
  if (!rawDate) return "방금 전";
  const date = new Date(rawDate);
  const diff = Date.now() - date.getTime();
  const minute = Math.floor(diff / 60000);
  if (minute < 1) return "방금 전";
  if (minute < 60) return `${minute}분 전`;
  const hour = Math.floor(minute / 60);
  if (hour < 24) return `${hour}시간 전`;
  const day = Math.floor(hour / 24);
  return `${day}일 전`;
};

const CommunityDetail = ({ board, onEdit, onDelete, onLikeChange }) => {
  const { memberId } = useAuthStore();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newPrivate, setNewPrivate] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [editText, setEditText] = useState("");
  const [editPrivate, setEditPrivate] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(board.likeCount ?? 0);
  const [scrapped, setScrapped] = useState(false);
  const commentsEndRef = useRef(null);

  useEffect(() => {
    setComments([]);
    setNewComment("");
    setNewPrivate(false);
    setReplyTarget(null);
    setEditTarget(null);
    setEditText("");
    setEditPrivate(false);
    setLikeCount(board.likeCount ?? 0);
    setScrapped(localStorage.getItem(`scrap_board_${board.boardNo}`) === "1");

    if (memberId) {
      axios
        .get(`${import.meta.env.VITE_BACKSERVER}/boards/${board.boardNo}/likes/${memberId}`)
        .then((res) => setLiked(res.data === true))
        .catch((err) => console.error("좋아요 여부 조회 실패", err));
    } else {
      setLiked(false);
    }
  }, [board.boardNo, board.likeCount, memberId]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [comments]);

  const handleAddComment = () => {
    if (!memberId) {
      Swal.fire({ icon: "warning", title: "로그인 후 댓글 작성 가능합니다." });
      return;
    }

    const text = newComment.trim();
    if (!text) {
      Swal.fire({ icon: "warning", title: "댓글을 입력해주세요" });
      return;
    }

    const nextComment = {
      id: Date.now(),
      memberId,
      memberNickname: memberId,
      content: text,
      isPrivate: newPrivate ? 1 : 0,
      edited: false,
      createdAt: new Date().toISOString(),
      depth: replyTarget ? (replyTarget.depth || 0) + 1 : 0,
      parentId: replyTarget ? replyTarget.id : null,
    };
    setComments((prev) => [...prev, nextComment]);
    setNewComment("");
    setNewPrivate(false);
    setReplyTarget(null);
  };

  const toggleLike = async () => {
    if (!memberId) {
      Swal.fire({ icon: "warning", title: "로그인이 필요합니다." });
      return;
    }

    try {
      if (!liked) {
        await axios.post(
          `${import.meta.env.VITE_BACKSERVER}/boards/${board.boardNo}/likes`,
          null,
          { params: { memberId } },
        );
        const nextCount = (likeCount ?? 0) + 1;
        setLiked(true);
        setLikeCount(nextCount);
        onLikeChange?.(board.boardNo, nextCount);
      } else {
        await axios.delete(
          `${import.meta.env.VITE_BACKSERVER}/boards/${board.boardNo}/likes`,
          { params: { memberId } },
        );
        const nextCount = (likeCount ?? 0) - 1;
        setLiked(false);
        setLikeCount(nextCount);
        onLikeChange?.(board.boardNo, nextCount);
      }
    } catch (err) {
      console.error("좋아요 처리 실패", err);
      Swal.fire({ icon: "error", title: "좋아요 처리 실패", text: "다시 시도해주세요." });
    }
  };

  const toggleScrap = () => {
    if (!memberId) {
      Swal.fire({ icon: "warning", title: "로그인이 필요합니다." });
      return;
    }
    setScrapped((prev) => {
      const next = !prev;
      localStorage.setItem(`scrap_board_${board.boardNo}`, next ? "1" : "0");
      return next;
    });
  };

  const handleReport = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "신고하기",
      text: "해당 게시글을 신고하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "신고",
      cancelButtonText: "취소",
      confirmButtonColor: "#c0392b",
    });
    if (result.isConfirmed) {
      Swal.fire({ icon: "success", title: "신고 접수되었습니다." });
    }
  };

  const handleStartReply = (comment) => {
    setReplyTarget(comment);
    setNewComment(`@${comment.memberNickname || comment.memberId} `);
    setNewPrivate(false);
  };

  const handleCancelReply = () => {
    setReplyTarget(null);
    setNewComment("");
    setNewPrivate(false);
  };

  const handleStartEdit = (comment) => {
    if (memberId !== comment.memberId) return;
    setEditTarget(comment);
    setEditText(comment.content);
    setEditPrivate(comment.isPrivate === 1);
  };

  const handleSaveEdit = () => {
    if (!editTarget) return;
    const text = editText.trim();
    if (!text) return;
    setComments((prev) =>
      prev.map((item) =>
        item.id === editTarget.id
          ? { ...item, content: text, isPrivate: editPrivate ? 1 : 0, edited: true }
          : item,
      ),
    );
    setEditTarget(null);
    setEditText("");
    setEditPrivate(false);
  };

  const handleDeleteComment = (comment) => {
    if (memberId !== comment.memberId) return;
    setComments((prev) => prev.filter((item) => item.id !== comment.id));
  };

  const commentTree = useMemo(() => {
    const root = [];
    const map = {};

    comments.forEach((comment) => {
      map[comment.id] = { ...comment, replies: [] };
    });

    comments.forEach((comment) => {
      if (comment.parentId && map[comment.parentId]) {
        map[comment.parentId].replies.push(map[comment.id]);
      } else {
        root.push(map[comment.id]);
      }
    });

    return root;
  }, [comments]);

  const renderComments = (items) =>
    items.map((comment) => {
      const isOwn = comment.memberId === memberId;
      const isSecret = comment.isPrivate === 1;
      const displayText = isSecret && !isOwn ? "비공개 댓글입니다." : comment.content;
      return (
        <div
          key={comment.id}
          className={styles.commentItem}
          style={{ marginLeft: `${comment.depth * 18}px` }}
        >
          <div className={styles.commentMeta}>
            <span>{comment.memberNickname || comment.memberId}</span>
            <span>{formatTime(comment.createdAt)}</span>
            {isSecret && <span className={styles.commentBadge}>비공개</span>}
          </div>
          {editTarget && editTarget.id === comment.id ? (
            <div className={styles.commentEditBox}>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className={styles.commentInput}
              />
              <label className={styles.privateCheck}>
                <input
                  type="checkbox"
                  checked={editPrivate}
                  onChange={(e) => setEditPrivate(e.target.checked)}
                />
                비공개
              </label>
              <button type="button" onClick={handleSaveEdit}>저장</button>
              <button type="button" onClick={() => setEditTarget(null)}>취소</button>
            </div>
          ) : (
            <p className={styles.commentText}>{displayText}</p>
          )}
          <div className={styles.commentActions}>
            <button type="button" className={styles.commentActionBtn} onClick={() => handleStartReply(comment)}>답글</button>
            {isOwn && <button type="button" className={styles.commentActionBtn} onClick={() => handleStartEdit(comment)}>수정</button>}
            {isOwn && <button type="button" className={styles.commentActionBtn} onClick={() => handleDeleteComment(comment)}>삭제</button>}
          </div>
          {comment.replies.length > 0 && renderComments(comment.replies)}
        </div>
      );
    });

  return (
    <div className={styles.boardDetailContainer} onClick={(e) => e.stopPropagation()}>
      <div className={styles.detailTopArea}>
        <div>
          <div className={styles.detailTitle}>{board.boardTitle}</div>
          <div className={styles.detailMeta}>
            <span>{board.writerNickname || board.writerId}</span>
            <span>·</span>
            <span>{formatTime(board.createDate)}</span>
          </div>
        </div>
        <div className={styles.detailButtonsTop}>
          <button type="button" className={`${styles.smallButton} ${liked ? styles.activeButton : ""}`} onClick={toggleLike}>
            {liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />} 좋아요 {likeCount}
          </button>
          <button type="button" className={`${styles.smallButton} ${scrapped ? styles.activeButton : ""}`} onClick={toggleScrap}>
            {scrapped ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />} 스크랩
          </button>
          <button type="button" className={`${styles.smallButton} ${styles.reportButton}`} onClick={handleReport}>
            <FlagIcon fontSize="small" /> 신고
          </button>
        </div>
      </div>

      <div className={styles.detailInfoPanel}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>조회수</span>
          <span className={styles.statValue}>{board.readCount ?? 0}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>좋아요</span>
          <span className={styles.statValue}>{likeCount}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>댓글</span>
          <span className={styles.statValue}>{board.commentCount ?? comments.length}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>작성자</span>
          <span className={styles.statValue}>{board.writerNickname || board.writerId}</span>
        </div>
      </div>

      <div className={styles.detailSectionHeader}>게시물 내용</div>
      <div className={styles.detailContentBox}>
        <div
          className={styles.detailContent}
          dangerouslySetInnerHTML={{ __html: board.boardContent || "<p>내용 없음</p>" }}
        />
        {board.boardThumb && (
          <div className={styles.detailImageWrap}>
            <img
              src={board.boardThumb}
              alt="게시글 이미지"
              className={styles.detailImage}
            />
          </div>
        )}
      </div>

      <div className={styles.detailActionsRow}>
        {memberId === board.writerId && (
          <>
            <button type="button" className={styles.detailActionBtn} onClick={() => onEdit(board)}>
              수정
            </button>
            <button type="button" className={styles.detailActionBtn} onClick={() => onDelete(board.boardNo)}>
              삭제
            </button>
          </>
        )}
      </div>

      <div className={styles.commentSection}>
        <h4>댓글</h4>
        <div className={styles.commentWrapper}>
          {comments.length === 0 && <p className={styles.commentEmpty}>등록된 댓글이 없습니다.</p>}
          {renderComments(commentTree)}
        </div>

        <div className={styles.commentForm}>
          {replyTarget && (
            <div className={styles.replyNote}>
              답글 대상: {replyTarget.memberNickname || replyTarget.memberId}
              <button type="button" onClick={handleCancelReply}>취소</button>
            </div>
          )}
          <div className={styles.commentFormRow}>
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className={styles.commentInput}
            />
            <label className={styles.privateCheck}>
              <input
                type="checkbox"
                checked={newPrivate}
                onChange={(e) => setNewPrivate(e.target.checked)}
              />
              비공개
            </label>
            <button type="button" onClick={handleAddComment} className={styles.detailActionBtn}>
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetail;
