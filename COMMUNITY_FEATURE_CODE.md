# 커뮤니티 기능 (간결 버전)

## ① 백엔드: 좋아요 API (BoardController.java)
```java
@GetMapping("/{boardNo}/likes/{memberId}")
public ResponseEntity<Boolean> isLiked(@PathVariable int boardNo, @PathVariable String memberId) {
    return ResponseEntity.ok(boardService.isBoardLiked(boardNo, memberId));
}

@PostMapping("/{boardNo}/likes")
public ResponseEntity<?> likeBoard(@PathVariable int boardNo, @RequestParam String memberId) {
    boardService.addBoardLike(boardNo, memberId);
    return ResponseEntity.ok().build();
}

@DeleteMapping("/{boardNo}/likes")
public ResponseEntity<?> unlikeBoard(@PathVariable int boardNo, @RequestParam String memberId) {
    boardService.removeBoardLike(boardNo, memberId);
    return ResponseEntity.ok().build();
}
```
**구현**: 좋아요 조회/추가/취소 API

---

## ② 백엔드: 신고 기능 (BoardController.java)
```java
@PostMapping("board-report")
public ResponseEntity<?> insertBoardReport(@RequestBody Report report) {
    int result = boardService.insertBoardReport(report);
    return ResponseEntity.ok(result);
}

@PostMapping("comment-report")
public ResponseEntity<?> insertCommentReport(@RequestBody Report report) {
    int result = boardService.insertBoardReport(report);
    return ResponseEntity.ok(result);
}
```
**구현**: 게시글/댓글 신고 접수

---

## ③ 프론트: 좋아요/스크랩 상태 조회 (CommunityDetail.jsx)
```jsx
useEffect(() => {
  if (memberId && board?.boardNo) {
    // 좋아요 여부 조회
    axios.get(`${BACKSERVER}/boards/${board.boardNo}/likes/${memberId}`)
      .then((res) => {
        setLiked(res.data === true);
      });

    // 팁 스크랩 여부 조회
    axios.get(`${BACKSERVER}/boards/${board.boardNo}/tips/${memberId}`)
      .then((res) => {
        setScrapped(res.data === true);
      });
  }
}, [board.boardNo, memberId]);
```
**구현**: 페이지 로드 시 좋아요/스크랩 상태 조회

---

## ④ 프론트: 댓글 CRUD (CommunityDetail.jsx)
```jsx
// 댓글 목록 조회
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
          isPrivate: item.isSecret === 1 || item.isSecret === "1",
          content: item.content,
          memberNickname: item.memberNickname || item.memberId,
        })),
      );
      setCommentCount(loaded.length);
      onCommentCountChange?.(board.boardNo, loaded.length);
    })
    .catch((err) => console.error("댓글 목록 조회 실패", err));
}, [board.boardNo]);

// 댓글 등록
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
    const response = await axios.post(
      `${BACKSERVER}/boards/${board.boardNo}/comments`,
      {
        content: text,
        memberId: memberId,
        parentCommentNo: replyTarget?.commentNo || null,
        isSecret: newPrivate ? 1 : 0,
      },
    );

    setComments([...comments, response.data]);
    setNewComment("");
    setNewPrivate(false);
    setReplyTarget(null);
  } catch (error) {
    console.error("댓글 등록 실패", error);
    alert("댓글 등록에 실패했습니다.");
  }
};
```
**구현 내용**: 댓글 목록 조회 → 일반/대댓글 등록 (비공개 설정 포함)

---

## ⑤ 프론트: 좋아요/스크랩 토글 (CommunityDetail.jsx)
```jsx
const handleLikeClick = async () => {
  if (!memberId) {
    Swal.fire({ icon: "warning", title: "로그인 후 이용 가능합니다." });
    return;
  }

  try {
    if (liked) {
      // 좋아요 취소
      await axios.delete(`${BACKSERVER}/boards/${board.boardNo}/likes`, {
        params: { memberId },
      });
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      // 좋아요 추가
      await axios.post(`${BACKSERVER}/boards/${board.boardNo}/likes`, null, {
        params: { memberId },
      });
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  } catch (error) {
    console.error("좋아요 처리 실패", error);
    alert("좋아요 처리에 실패했습니다.");
  }
};

const handleScrapClick = async () => {
  if (!memberId) {
    Swal.fire({ icon: "warning", title: "로그인 후 이용 가능합니다." });
    return;
  }

  try {
    if (scrapped) {
      // 스크랩 취소
      await axios.delete(`${BACKSERVER}/boards/${board.boardNo}/tips`, {
        params: { memberId },
      });
      setScrapped(false);
    } else {
      // 스크랩 추가
      await axios.post(`${BACKSERVER}/boards/${board.boardNo}/tips`, null, {
        params: { memberId },
      });
      setScrapped(true);
    }
  } catch (error) {
    console.error("스크랩 처리 실패", error);
    alert("스크랩 처리에 실패했습니다.");
  }
};
```
**구현 내용**: 좋아요/스크랩 상태 토글 + 카운트 실시간 업데이트

---

## ⑥ 프론트: 신고 팝업 (CommunityDetail.jsx)
```jsx
const handleReportClick = (type, targetId) => {
  Swal.fire({
    title: "신고 사유를 선택해주세요",
    input: "select",
    inputOptions: {
      "부적절한 내용": "부적절한 내용",
      "스팸 또는 광고": "스팸 또는 광고",
      "욕설 또는 인신공격": "욕설 또는 인신공격",
      "개인정보 노출": "개인정보 노출",
    },
    inputPlaceholder: "신고 사유 선택",
    showCancelButton: true,
    confirmButtonText: "신고",
    cancelButtonText: "취소",
  }).then(async (result) => {
    if (result.isConfirmed && result.value) {
      try {
        await axios.post(`${BACKSERVER}/boards/${type}-report`, {
          reportReason: result.value,
          boardNo: type === "board" ? board.boardNo : undefined,
          commentNo: type === "comment" ? targetId : undefined,
          reporterId: memberId,
        });
        Swal.fire({ icon: "success", title: "신고 접수되었습니다." });
        setReportedCommentIds([...reportedCommentIds, targetId]);
      } catch (error) {
        console.error("신고 처리 실패", error);
        alert("신고 처리에 실패했습니다.");
      }
    }
  });
};
```
**구현 내용**: Swal 팝업으로 신고 사유 선택 → 서버 전송
