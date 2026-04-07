package kr.co.iei.board.controller;


import java.io.File;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.board.model.service.BoardService;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.BoardComment;
import kr.co.iei.board.model.vo.BoardLike;
import kr.co.iei.utils.FileUtils;

@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"})
@RestController
@RequestMapping(value="/boards")
public class BoardController {
	@Autowired
	private BoardService boardService;
	
	// application.properties의 file.root 값을 주입받아 파일 업로드/조회 경로를 결정합니다.
	// Windows 와 macOS 모두에서 동작하도록 File 객체로 경로를 생성합니다.
	@Value("${file.root}")
	private String root;

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

		// root 설정값을 실제 OS 경로로 변환합니다. Windows, macOS 모두 정상 동작해야 합니다.
		File saveDir = new File(new File(root), "board/editor");
		if (!saveDir.exists()) {
			saveDir.mkdirs();
		}

		String fileName = FileUtils.upload(saveDir.getAbsolutePath() + File.separator, upfile);
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

	@GetMapping("/{boardNo}/comments")
	public ResponseEntity<?> getBoardComments(@PathVariable int boardNo) {
		return ResponseEntity.ok(boardService.getBoardComments(boardNo));
	}

	@PostMapping("/{boardNo}/comments")
	public ResponseEntity<?> addBoardComment(@PathVariable int boardNo, @RequestBody BoardComment comment) {
		comment.setBoardNo(boardNo);
		BoardComment saved = boardService.addBoardComment(comment);
		return ResponseEntity.ok(saved);
	}

	@PutMapping("/{boardNo}/comments/{commentNo}")
	public ResponseEntity<?> editBoardComment(@PathVariable int boardNo,
	                                         @PathVariable long commentNo,
	                                         @RequestBody BoardComment comment) {
		comment.setBoardNo(boardNo);
		comment.setCommentNo(commentNo);
		boardService.editBoardComment(comment);
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/{boardNo}/comments/{commentNo}")
	public ResponseEntity<?> deleteBoardComment(@PathVariable int boardNo,
	                                           @PathVariable long commentNo,
	                                           @RequestParam String memberId) {
		boardService.removeBoardComment(commentNo, memberId);
		return ResponseEntity.ok().build();
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
	public ResponseEntity<?> selectMemberIdBoard(@PathVariable String memberId, @RequestParam(defaultValue = "") String searchBoard, @RequestParam(defaultValue = "2") String filter,
			@RequestParam(defaultValue="1") Integer checker) {
		HashMap<String, Object> map = new HashMap<>();
		map.put("checker", checker);
		map.put("searchBoard", searchBoard);
		map.put("memberId", memberId);
		map.put("filter", filter);
		 List<Board> list = boardService.selectMemberIdBoard(map);
		 return ResponseEntity.ok(list);
	 }
	 
	 
}
