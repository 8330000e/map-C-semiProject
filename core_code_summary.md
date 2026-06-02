# 핵심 코드 요약

## 백엔드: `BoardController` 핵심 API

### 게시글 목록 조회
```java
@GetMapping
public HashMap<String, Object> selectBoardList(
        @RequestParam(defaultValue = "0") int status,
        @RequestParam(defaultValue = "1") int searchType,
        @RequestParam(defaultValue = "") String searchKeyword,
        @RequestParam(required = false) String sido,
        @RequestParam(required = false) String sigungu,
        @RequestParam(defaultValue = "popular") String sortType
) {
    List<Board> list = boardService.selectBoardList(
            status, searchType, searchKeyword, sido, sigungu, sortType
    );

    List<HashMap<String, Object>> mapped = list.stream()
        .map(board -> {
            HashMap<String, Object> map = new HashMap<>();
            map.put("boardNo", board.getBoardNo());
            map.put("writerId", board.getWriterId());
            map.put("boardTitle", board.getBoardTitle());
            map.put("boardContent", board.getBoardContent());
            map.put("boardThumb", board.getBoardThumb());
            map.put("boardDate", board.getBoardDate());
            map.put("memberNickname", board.getMemberNickname());
            map.put("boardStatus", board.getBoardStatus());
            map.put("readCount", board.getReadCount());
            map.put("likeCount", board.getLikeCount());
            map.put("commentCount", board.getCommentCount());
            return map;
        })
        .collect(Collectors.toList());

    HashMap<String, Object> result = new HashMap<>();
    result.put("items", mapped);
    return result;
}
```

### 게시글 작성
```java
@PostMapping
public HashMap<String, Object> insertBoard(@RequestBody Board board, HttpServletRequest request) {
    String ip = request.getRemoteAddr();
    if (ip.equals("0:0:0:0:0:0:0:1")) {
        ip = "127.0.0.1";
    }
    String device = DeviceParser.parse(request.getHeader("User-Agent"));
    return boardService.insertBoard(board, ip, device);
}
```

### 에디터 이미지 업로드
```java
@PostMapping("/editor/upload")
public String uploadEditorImage(@RequestParam("upfile") MultipartFile upfile) {
    if (upfile == null || upfile.isEmpty()) {
        throw new RuntimeException("업로드할 파일이 없습니다.");
    }

    File saveDir = new File(new File(root), "board/editor");
    if (!saveDir.exists()) {
        saveDir.mkdirs();
    }

    String fileName = FileUtils.upload(saveDir.getAbsolutePath() + File.separator, upfile);
    return fileName;
}
```

### 게시글 수정 / 삭제
```java
@PatchMapping("/{boardNo}")
public ResponseEntity<?> updateBoard(
        @PathVariable int boardNo,
        @RequestBody Board board,
        @RequestParam String memberId
) {
    if (!boardService.isBoardAuthor(boardNo, memberId)) {
        return ResponseEntity.status(403).body("작성자만 수정할 수 있습니다.");
    }
    board.setBoardNo(boardNo);
    int result = boardService.updateBoard(board);
    return ResponseEntity.ok(result);
}

@DeleteMapping("/{boardNo}")
public ResponseEntity<?> deleteBoard(@PathVariable int boardNo, @RequestParam String memberId) {
    if (!boardService.isBoardAuthor(boardNo, memberId)) {
        return ResponseEntity.status(403).body("작성자만 삭제할 수 있습니다.");
    }
    int result = boardService.deleteBoard(boardNo);
    return ResponseEntity.ok(result);
}
```

### 댓글 등록
```java
@PostMapping("/{boardNo}/comments")
public ResponseEntity<?> addBoardComment(
        @PathVariable int boardNo,
        @RequestBody BoardComment comment,
        HttpServletRequest request
) {
    comment.setBoardNo(boardNo);

    String ip = request.getRemoteAddr();
    if (ip.equals("0:0:0:0:0:0:0:1")) {
        ip = "127.0.0.1";
    }
    String device = DeviceParser.parse(request.getHeader("User-Agent"));

    BoardComment saved = boardService.addBoardComment(comment, ip, device);
    return ResponseEntity.ok(saved);
}
```

---

## 프론트엔드: `CartPage.jsx` 핵심 로직

```jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import { normalizeImageUrl } from "../../utils/getImageUrl";

const BACKSERVER = import.meta.env.VITE_BACKSERVER || "http://localhost:9999";
const getImageUrl = normalizeImageUrl;
const formatPrice = (value) => `${Number(value || 0).toLocaleString("ko-KR")}원`;

const CartPage = () => {
  const { memberId, isReady } = useAuthStore();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      if (!memberId) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const res = await axios.get(`${BACKSERVER}/api/store/cart`, {
          params: { memberId },
        });
        setCartItems(Array.isArray(res.data) ? res.data : []);
        setErrorMessage("");
      } catch (error) {
        console.error("장바구니 조회 실패", error);
        setErrorMessage("장바구니 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    loadCart();
  }, [memberId]);

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.productPrice || 0), 0),
    [cartItems],
  );

  const handleGoToDetail = (marketNo) => {
    if (!marketNo) return;
    navigate(`/store/${marketNo}`);
  };

  const handleRemove = async (cartNo) => {
    if (!cartNo) {
      alert("삭제할 상품 식별자가 없습니다. 새로고침 후 다시 시도해주세요.");
      return;
    }
    try {
      await axios.delete(`${BACKSERVER}/api/store/cart/${cartNo}`, {
        params: { memberId },
      });
      setCartItems((prev) => prev.filter((item) => item.cartNo !== cartNo));
    } catch (error) {
      console.error("장바구니 삭제 실패", error);
      alert("장바구니에서 상품을 삭제하지 못했습니다.");
    }
  };

  return (
    <div>
      {isLoading ? (
        <div>로딩 중입니다...</div>
      ) : errorMessage ? (
        <div>{errorMessage}</div>
      ) : cartItems.length === 0 ? (
        <div>찜한 상품이 없습니다.</div>
      ) : (
        <>
          <div>전체 금액: {formatPrice(totalAmount)}</div>
          {cartItems.map((item) => {
            const imageUrl = getImageUrl(item.productThumb);
            return (
              <div key={item.cartNo ?? item.marketNo}>
                <Link to={`/store/${item.marketNo}`}>
                  {imageUrl ? <img src={imageUrl} alt={item.marketTitle || "상품 이미지"} /> : <span>이미지 없음</span>}
                  <div>{item.marketTitle || "상품명 없음"}</div>
                </Link>
                <div>{formatPrice(item.productPrice)}</div>
                <button type="button" onClick={() => handleGoToDetail(item.marketNo)}>바로가기</button>
                <button type="button" onClick={() => handleRemove(item.cartNo)}>삭제</button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default CartPage;
```

> 이 파일을 캡처하시면 이전보다 더 짧고 가독성 좋은 핵심 코드 자료를 만들 수 있습니다.
