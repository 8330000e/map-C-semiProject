package kr.co.iei.board.model.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.board.model.dao.BoardDao;
import kr.co.iei.board.model.vo.Board;

@Service
public class BoardService {
	@Autowired
	private BoardDao boardDao;

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
	    return boardDao.deleteBoard(boardNo);
	}
}
