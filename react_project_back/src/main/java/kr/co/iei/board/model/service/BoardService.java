package kr.co.iei.board.model.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.board.model.dao.BoardDao;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.BoardFile;
import kr.co.iei.board.model.vo.BoardLike;
import kr.co.iei.utils.FileUtils;

@Service
public class BoardService {
	@Autowired
	private BoardDao boardDao;
	@Autowired
	private FileUtils fileUtils;
	//게시글 조회
	public List<Board> selectBoardList(int status, int searchType, String searchKeyword) {
		HashMap<String, Object> param = new HashMap<>();
        param.put("status", status);
        param.put("searchType", searchType);
        param.put("searchKeyword", searchKeyword);

        return boardDao.selectBoardList(param);
		
	}
	//게시글 작성
	public int insertBoard(Board board) {
		int result = boardDao.insertBoard(board);
		return result;
	}

	//게시글 수정
	public int updateBoard(Board board) {
	    return boardDao.updateBoard(board);
	}

	// 게시글 삭제
	public int deleteBoard(int boardNo) {
	    try {
	        int result = boardDao.deleteBoard(boardNo);
	        return result;
	    } catch (Exception e) {
	        e.printStackTrace();
	        throw e;
	    }
	}
	@Transactional
	public int insertBoardFiles(int boardNo, String memberId, MultipartFile[] files) {
	    int result = 0;
	    String savePath = "C:/Temp/upload/board/files/";

	    for (MultipartFile file : files) {
	        if (file == null || file.isEmpty()) {
	            continue;
	        }

	        String filePath = fileUtils.upload(savePath, file);

	        BoardFile boardFile = new BoardFile();
	        boardFile.setBoardNo(boardNo);
	        boardFile.setMemberId(memberId);
	        boardFile.setBoardFileName(file.getOriginalFilename());
	        boardFile.setBoardFilePath(filePath);

	        result += boardDao.insertBoardFile(boardFile);
	    }

	    return result;
	}
	public List<BoardLike> bestBoardList() {
		List<BoardLike> list = boardDao.bestBoardList();
	}
	
	public List<Board> selectMemberIdBoard(HashMap<String, String> map) {
		List<Board> list = boardDao.selectMemberIdBoard(map);
		return list;
	}
}

