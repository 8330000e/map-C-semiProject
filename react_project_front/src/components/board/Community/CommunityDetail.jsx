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

const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";

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

const getImageUrl = (thumb) => {
  if (!thumb) return null;
  if (typeof thumb !== "string") return null;
  let trimmed = thumb.trim();
  if (!trimmed) return null;

  trimmed = trimmed.replace(/\\\\/g, "/").replace(/\\/g, "/");

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;

  const driveMatch = trimmed.match(/^[A-Za-z]:\//);
  if (driveMatch) {
    const boardIndex = trimmed.indexOf("/board/editor/");
    if (boardIndex !== -1) {
      const suffix = trimmed.substring(boardIndex);
      return `${BACKSERVER}${suffix.startsWith("/") ? "" : "/"}${suffix}`;
    }
    trimmed = trimmed.substring(trimmed.indexOf("/") + 1);
  }

  if (trimmed.startsWith("/")) return `${BACKSERVER}${trimmed}`;
  if (trimmed.includes("/upload/")) return `${BACKSERVER}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  if (trimmed.includes("/board/editor/")) return `${BACKSERVER}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
  if (trimmed.match(/^.+\.(jpg|jpeg|png|gif|bmp)$/i)) return `${BACKSERVER}/board/editor/${trimmed.replace(/^\//, "")}`;
  return `${BACKSERVER}/board/editor/${trimmed}`;
};

const hasImageInContent = (html) => {
  if (!html) return false;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.querySelector("img") !== null;
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

    if (memberId && board?.boardNo) {
      axios
        .get(
          `${import.meta.env.VITE_BACKSERVER}/boards/${board.boardNo}/likes/${memberId}`,
        )
        .then((res) => setLiked(res.data === true))
        .catch((err) => console.error("좋아요 여부 조회 실패", err));
    } else {
      if (memberId && !board?.boardNo) {
        console.warn("boardNo is undefined, skipping like status fetch.", board);
      }
      setLiked(false);
    }
  }, [board.boardNo, board.likeCount, memberId]);

  useEffect(() => {
    if (!board?.boardNo) {
      setComments([]);
      return;
    }

    axios
      .get(`${BACKSERVER}/boards/${board.boardNo}/comments`)
      .then((res) => {
        const loaded = Array.isArray(res.data) ? res.data : [];
        setComments(
          loaded.map((item) => ({
            ...item,
            id: item.commentNo,
            parentId: item.parentCommentNo,
            depth: item.commentDepth,
            isPrivate: item.isSecret,
            content: item.content,
            memberNickname: item.memberNickname || item.memberId,
          })),
        );
      })
      .catch((err) => console.error("댓글 목록 조회 실패", err));
  }, [board.boardNo]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [comments]);

  const handleAddComment = async () => {
    if (!memberId) {
      Swal.fire({ icon: "warning", title: "로그인 후 댓글 작성 가능합니다." });
      return;
    }

    const text = newComment.trim();
    if (!text) {
      Swal.fire({ icon: "warning", title: "댓글을 입력해주세요" });
      return;
    }

    try {
      const payload = {
        memberId,
        memberNickname: memberId,
        content: text,
        isSecret: newPrivate ? 1 : 0,
        parentCommentNo: replyTarget ? replyTarget.id : null,
      };

      const res = await axios.post(`${BACKSERVER}/boards/${board.boardNo}/comments`, payload);
      const saved = res.data;
      const addedComment = {
        ...saved,
        id: saved.commentNo,
        parentId: saved.parentCommentNo,
        depth: saved.commentDepth,
        isPrivate: saved.isSecret,
        content: saved.content,
      };

      setComments((prev) => [...prev, addedComment]);
      setNewComment("");
      setNewPrivate(false);
      setReplyTarget(null);
    } catch (err) {
      console.error("댓글 등록 실패", err);
      Swal.fire({ icon: "error", title: "댓글 등록 실패", text: "댓글 등록 중 오류가 발생했습니다." });
    }
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
      Swal.fire({
        icon: "error",
        title: "좋아요 처리 실패",
        text: "다시 시도해주세요.",
      });
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

  const handleSaveEdit = async () => {
    if (!editTarget) return;
    const text = editText.trim();
    if (!text) return;

    try {
      await axios.put(`${BACKSERVER}/boards/${board.boardNo}/comments/${editTarget.id}`, {
        memberId,
        content: text,
        isSecret: editPrivate ? 1 : 0,
      });

      setComments((prev) =>
        prev.map((item) =>
          item.id === editTarget.id
            ? {
                ...item,
                content: text,
                isPrivate: editPrivate ? 1 : 0,
                edited: true,
              }
            : item,
        ),
      );
      setEditTarget(null);
      setEditText("");
      setEditPrivate(false);
    } catch (err) {
      console.error("댓글 수정 실패", err);
      Swal.fire({ icon: "error", title: "댓글 수정 실패", text: "댓글 수정 중 오류가 발생했습니다." });
    }
  };

  const handleDeleteComment = async (comment) => {
    if (memberId !== comment.memberId) return;

    const result = await Swal.fire({
      icon: "warning",
      title: "댓글을 삭제하시겠습니까?",
      text: "삭제된 댓글은 복구할 수 없습니다.",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${BACKSERVER}/boards/${board.boardNo}/comments/${comment.id}`, {
        params: { memberId },
      });
      setComments((prev) => prev.filter((item) => item.id !== comment.id));
      Swal.fire({ icon: "success", title: "댓글이 삭제되었습니다." });
    } catch (err) {
      console.error("댓글 삭제 실패", err);
      Swal.fire({ icon: "error", title: "댓글 삭제 실패", text: "댓글 삭제 중 오류가 발생했습니다." });
    }
  };

  const commentMap = useMemo(() => {
    const map = {};
    comments.forEach((comment) => {
      map[comment.id] = comment;
    });
    return map;
  }, [comments]);

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

  const canViewSecretComment = (comment) => {
    if (comment.isPrivate !== 1) return true;
    const isOwn = comment.memberId === memberId;
    const isBoardAuthor = memberId && board.writerId === memberId;
    const parentAuthorId = comment.parentId ? commentMap[comment.parentId]?.memberId : null;
    return Boolean(isOwn || isBoardAuthor || parentAuthorId === memberId);
  };

  const renderComments = (items) =>
    items.map((comment) => {
      const isOwn = comment.memberId === memberId;
      const isSecret = comment.isPrivate === 1;
      const displayText =
        isSecret && !canViewSecretComment(comment)
          ? "비공개 댓글입니다."
          : comment.content;
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
              <button type="button" onClick={handleSaveEdit}>
                저장
              </button>
              <button type="button" onClick={() => setEditTarget(null)}>
                취소
              </button>
            </div>
          ) : (
            <p className={styles.commentText}>{displayText}</p>
          )}
          <div className={styles.commentActions}>
            <button
              type="button"
              className={styles.commentActionBtn}
              onClick={() => handleStartReply(comment)}
            >
              답글
            </button>
            {isOwn && (
              <button
                type="button"
                className={styles.commentActionBtn}
                onClick={() => handleStartEdit(comment)}
              >
                수정
              </button>
            )}
            {isOwn && (
              <button
                type="button"
                className={styles.commentActionBtn}
                onClick={() => handleDeleteComment(comment)}
              >
                삭제
              </button>
            )}
          </div>
          {comment.replies.length > 0 && renderComments(comment.replies)}
        </div>
      );
    });

  return (
    <div
      className={styles.boardDetailContainer}
      onClick={(e) => e.stopPropagation()}
    >
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
          <button
            type="button"
            className={`${styles.smallButton} ${liked ? styles.activeButton : ""}`}
            onClick={toggleLike}
          >
            {liked ? (
              <FavoriteIcon fontSize="small" />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}{" "}
            좋아요 {likeCount}
          </button>
          <button
            type="button"
            className={`${styles.smallButton} ${scrapped ? styles.activeButton : ""}`}
            onClick={toggleScrap}
          >
            {scrapped ? (
              <BookmarkIcon fontSize="small" />
            ) : (
              <BookmarkBorderIcon fontSize="small" />
            )}{" "}
            스크랩
          </button>
          <button
            type="button"
            className={`${styles.smallButton} ${styles.reportButton}`}
            onClick={handleReport}
          >
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
          <span className={styles.statValue}>
            {board.commentCount ?? comments.length}
          </span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>작성자</span>
          <span className={styles.statValue}>
            {board.writerNickname || board.writerId}
          </span>
        </div>
      </div>

      <div className={styles.detailSectionHeader}>게시물 내용</div>
      <div className={styles.detailContentBox}>
        <div
          className={styles.detailContent}
          dangerouslySetInnerHTML={{
            __html: board.boardContent || "<p>내용 없음</p>",
          }}
        />
        {!hasImageInContent(board.boardContent) && board.boardThumb && (
          <div className={styles.detailImageWrap}>
            {/* board.boardThumb가 파일명으로 와도 /upload/로 바꿔서 보여줘요. */}
            <img
              src={getImageUrl(board.boardThumb)}
              alt="게시글 이미지"
              className={styles.detailImage}
            />
          </div>
        )}
      </div>

      <div className={styles.detailActionsRow}>
        {memberId === board.writerId && (
          <>
            <button
              type="button"
              className={styles.detailActionBtn}
              onClick={() => onEdit(board)}
            >
              수정
            </button>
            <button
              type="button"
              className={styles.detailActionBtn}
              onClick={() => onDelete(board.boardNo)}
            >
              삭제
            </button>
          </>
        )}
      </div>

      <div className={styles.commentSection}>
        <h4>댓글</h4>
        <div className={styles.commentWrapper}>
          {comments.length === 0 && (
            <p className={styles.commentEmpty}>등록된 댓글이 없습니다.</p>
          )}
          {renderComments(commentTree)}
        </div>

        <div className={styles.commentForm}>
          {replyTarget && (
            <div className={styles.replyNote}>
              답글 대상: {replyTarget.memberNickname || replyTarget.memberId}
              <button type="button" onClick={handleCancelReply}>
                취소
              </button>
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
            <button
              type="button"
              onClick={handleAddComment}
              className={styles.detailActionBtn}
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetail;
