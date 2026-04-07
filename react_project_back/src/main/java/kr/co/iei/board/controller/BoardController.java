package kr.co.iei.board.controller;


import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.board.model.service.BoardService;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.BoardLike;
import kr.co.iei.utils.FileUtils;

@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"})
@RestController
@RequestMapping(value="/boards")
public class BoardController {
	@Autowired
	private BoardService boardService;
	
	//이미지 경로
	@Autowired
    private FileUtils fileUtils;
	
	
	//게시글 조회
	@GetMapping
    public HashMap<String, Object> selectBoardList(
            @RequestParam(defaultValue = "0") int status,
            @RequestParam(defaultValue = "1") int searchType,
            @RequestParam(defaultValue = "") String searchKeyword,
            @RequestParam(required = false) String sido,
            @RequestParam(required = false) String sigungu
    ) {
        List<Board> list = boardService.selectBoardList(status, searchType, searchKeyword);

        HashMap<String, Object> result = new HashMap<>();
        result.put("items", list);
        return result;
    }
	//게시글 작성
	@PostMapping
	public Board insertBoard(@RequestBody Board board) {
	    boardService.insertBoard(board);
	    return board;
	}
	//이미지 저장
	 @PostMapping("/editor/upload")
	    public String uploadEditorImage(@RequestParam("upfile") MultipartFile upfile) {
	        if (upfile == null || upfile.isEmpty()) {
	            throw new RuntimeException("업로드할 파일이 없습니다.");
	        }

	        String savePath = "C:/Temp/upload/board/editor/";
	        String fileName = fileUtils.upload(savePath, upfile);
	        return "/board/editor/" + fileName;
	    }
	 
	// 수정
	 @PatchMapping("/{boardNo}")
	 public ResponseEntity<?> updateBoard(@PathVariable int boardNo, @RequestBody Board board, @RequestParam String memberId) {
	     if (!boardService.isBoardAuthor(boardNo, memberId)) {
	         return ResponseEntity.status(403).body("작성자만 수정할 수 있습니다.");
	     }
	     board.setBoardNo(boardNo);
	     int result = boardService.updateBoard(board);
	     return ResponseEntity.ok(result);
	 }

	 // 삭제
	 @DeleteMapping("/{boardNo}")
	 public ResponseEntity<?> deleteBoard(@PathVariable int boardNo, @RequestParam String memberId) {
	     if (!boardService.isBoardAuthor(boardNo, memberId)) {
	         return ResponseEntity.status(403).body("작성자만 삭제할 수 있습니다.");
	     }
	     int result = boardService.deleteBoard(boardNo);
	     return ResponseEntity.ok(result);
	 }
	 @PostMapping("/{boardNo}/files")
	 public int uploadBoardFiles(
	         @PathVariable int boardNo,
	         @RequestParam("files") MultipartFile[] files,
	         @RequestParam("memberId") String memberId
	 ) {
	     return boardService.insertBoardFiles(boardNo, memberId, files);
	 }

	@GetMapping("/{boardNo}/read")
	public ResponseEntity<?> incrementReadCount(@PathVariable int boardNo) {
		try {
			boardService.incrementReadCount(boardNo);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body("조회수 증가 실패: " + e.getMessage());
		}
	}

	@GetMapping("/{boardNo}/likes/{memberId}")
	public ResponseEntity<Boolean> isLiked(@PathVariable int boardNo, @PathVariable String memberId) {
		try {
			return ResponseEntity.ok(boardService.isBoardLiked(boardNo, memberId));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().build();
		}
	}

	@PostMapping("/{boardNo}/likes")
	public ResponseEntity<?> likeBoard(@PathVariable int boardNo, @RequestParam String memberId) {
		try {
			boardService.addBoardLike(boardNo, memberId);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body("좋아요 처리 실패: " + e.getMessage());
		}
	}

	@DeleteMapping("/{boardNo}/likes")
	public ResponseEntity<?> unlikeBoard(@PathVariable int boardNo, @RequestParam String memberId) {
		try {
			boardService.removeBoardLike(boardNo, memberId);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body("좋아요 취소 실패: " + e.getMessage());
		}
	}
	 
	// frontend에서 인기 게시글을 조회하기 위해 추가한 엔드포인트입니다.
	// Bestpostlist.jsx에서 /boards/best로 요청하여 top 게시글 목록을 받아옵니다.
	@GetMapping(value="/best")
	public List<BoardLike> bestBoardList() {
		return boardService.bestBoardList();
	}
	 
	@GetMapping(value="{memberId}")
	public ResponseEntity<?> selectMemberIdBoard(@PathVariable String memberId, @RequestParam(defaultValue = "") String searchBoard, @RequestParam(defaultValue = "1") String filter) {
		HashMap<String, String> map = new HashMap<>();
		map.put("searchBoard", searchBoard);
		map.put("memberId", memberId);
		map.put("filter", filter);
		 List<Board> list = boardService.selectMemberIdBoard(map);
		 return ResponseEntity.ok(list);
	 }
	 
	 
}
