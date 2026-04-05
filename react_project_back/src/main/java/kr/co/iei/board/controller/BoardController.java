package kr.co.iei.board.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import kr.co.iei.utils.FileUtils;

@CrossOrigin(value="*")
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
    public int insertBoard(@RequestBody Board board) {
        int result = boardService.insertBoard(board);
        return result; 
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
	 public int updateBoard(@PathVariable int boardNo, @RequestBody Board board) {
	     board.setBoardNo(boardNo);
	     return boardService.updateBoard(board);
	 }

	 // 삭제
	 @DeleteMapping("/{boardNo}")
	 public int deleteBoard(@PathVariable int boardNo) {
	     return boardService.deleteBoard(boardNo);
	 }
    
}
