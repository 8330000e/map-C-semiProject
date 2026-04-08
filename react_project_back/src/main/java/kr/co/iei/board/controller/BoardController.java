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
	// 이미지 저장 엔드포인트
	@PostMapping("/editor/upload")
	public String uploadEditorImage(@RequestParam("upfile") MultipartFile upfile) {
		// 업로드 파일이 없으면 예외 처리
		if (upfile == null || upfile.isEmpty()) {
			throw new RuntimeException("업로드할 파일이 없습니다.");
		}

		// application.properties에 설정된 root 경로 아래 board/editor 폴더로 저장합니다.
		// 예: file.root=./upload/semiproject/ 인 경우 실제 저장 경로는
		// react_project_back/upload/semiproject/board/editor 가 됩니다.
		File saveDir = new File(new File(root), "board/editor");
		if (!saveDir.exists()) {
			saveDir.mkdirs();
		}

		// 업로드 파일을 실제 디스크에 저장하고, 저장된 파일명만 반환받습니다.
		String fileName = FileUtils.upload(saveDir.getAbsolutePath() + File.separator, upfile);

		// 프론트는 이 리턴 값을 기반으로 이미지 URL을 구성합니다.
		// 예: http://localhost:9999/board/editor/{fileName}
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
		// 댓글 등록 요청 처리
		// front에서 boardNo는 URL 경로로, 댓글 내용과 작성자 정보는 body로 전달됩니다.
		comment.setBoardNo(boardNo);
		BoardComment saved = boardService.addBoardComment(comment);
		return ResponseEntity.ok(saved);
	}

	@PutMapping("/{boardNo}/comments/{commentNo}")
	public ResponseEntity<?> editBoardComment(@PathVariable int boardNo,
	                                         @PathVariable long commentNo,
	                                         @RequestBody BoardComment comment) {
		// 댓글 수정 요청 처리
		// URL 경로로 boardNo와 commentNo를 받으며, body에는 수정 내용과 비공개 여부가 포함됩니다.
		comment.setBoardNo(boardNo);
		comment.setCommentNo(commentNo);
		boardService.editBoardComment(comment);
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/{boardNo}/comments/{commentNo}")
	public ResponseEntity<?> deleteBoardComment(@PathVariable int boardNo,
	                                           @PathVariable long commentNo,
	                                           @RequestParam String memberId) {
		// 댓글 삭제 요청 처리
		// 요청자는 memberId 쿼리 파라미터로 전달하며 작성자만 삭제할 수 있습니다.
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
