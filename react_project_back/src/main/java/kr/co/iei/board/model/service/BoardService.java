package kr.co.iei.board.model.service;

import java.io.File;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.board.model.dao.BoardDao;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.BoardComment;
import kr.co.iei.board.model.vo.BoardFile;
import kr.co.iei.board.model.vo.BoardLike;
import kr.co.iei.mission.model.service.MissionService;
import kr.co.iei.utils.FileUtils;

@Service
public class BoardService {
	@Autowired
	private BoardDao boardDao;
	
	@Autowired
	private MissionService missionService;

	@Value("${file.root}")
	private String root;
	
	
	//게시글 조회
	public List<Board> selectBoardList(int status, int searchType, String searchKeyword) {
		HashMap<String, Object> param = new HashMap<>();
        param.put("status", status);
        param.put("searchType", searchType);
        param.put("searchKeyword", searchKeyword);

        return boardDao.selectBoardList(param);
		
	}
	//게시글 작성
	@Transactional
	public int insertBoard(Board board) {
		int result = boardDao.insertBoard(board);

		if (result > 0) {
			missionService.completeBasicMission(board.getWriterId());
		}

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

	public int incrementReadCount(int boardNo) {
		return boardDao.incrementReadCount(boardNo);
	}

	public int addBoardLike(int boardNo, String memberId) {
		return boardDao.insertBoardLike(boardNo, memberId);
	}

	public int removeBoardLike(int boardNo, String memberId) {
		return boardDao.deleteBoardLike(boardNo, memberId);
	}

	public List<BoardComment> getBoardComments(int boardNo) {
		return boardDao.selectBoardComments(boardNo);
	}

	public BoardComment addBoardComment(BoardComment comment) {
		boardDao.insertBoardComment(comment);
		return comment;
	}

	public int editBoardComment(BoardComment comment) {
		return boardDao.updateBoardComment(comment);
	}

	public int removeBoardComment(long commentNo, String memberId) {
		return boardDao.deleteBoardComment(commentNo, memberId);
	}

	public boolean isBoardLiked(int boardNo, String memberId) {
		return boardDao.selectBoardLikeByMember(boardNo, memberId) > 0;
	}

	public boolean isBoardAuthor(int boardNo, String writerId) {
		return boardDao.selectBoardAuthor(boardNo, writerId) > 0;
	}
	@Transactional
	public int insertBoardFiles(int boardNo, String memberId, MultipartFile[] files) {
	    int result = 0;
	    File saveDir = new File(new File(root), "board/files");
	    if (!saveDir.exists()) {
	        saveDir.mkdirs();
	    }

	    for (MultipartFile file : files) {
	        if (file == null || file.isEmpty()) {
	            continue;
	        }

	        String filePath = FileUtils.upload(saveDir.getAbsolutePath() + File.separator, file);

	        BoardFile boardFile = new BoardFile();
	        boardFile.setBoardNo(boardNo);
	        boardFile.setMemberId(memberId);
	        boardFile.setBoardFileName(filePath);
	        boardFile.setBoardFilePath(filePath);

	        result += boardDao.insertBoardFile(boardFile);
	    }

	    return result;
	}
	// 인기 게시글 조회 비즈니스 로직
	// BoardController.bestBoardList()에서 호출되어 DAO에서 결과를 가져옵니다.
	public List<BoardLike> bestBoardList() {
		return boardDao.bestBoardList();
	}
	
	public List<Board> selectMemberIdBoard(HashMap<String, Object> map) {
		Integer checker = (Integer)(map.get("checker"));
		if(checker ==1) {
			List<Board> list = boardDao.selectMemberIdBoard(map);
			return list;
		}
		if(checker == 2) {
			String memberId=map.get("memberId").toString();
			List <Integer> boardNoList =boardDao.selectLikeBoard(memberId);	
			map.put("boardNoList",boardNoList );
			System.out.println(boardNoList);
			List<Board> list = boardDao.selectMemberIdBoard(map);
			return list;
		}
		if(checker == 3) {
			String memberId=map.get("memberId").toString();
			List <Integer> tipList = boardDao.selectTipBoard(memberId);
			map.put("tipList", tipList);
			System.out.println(tipList);
			List<Board> list = boardDao.selectMemberIdBoard(map);
			return list;
		}
		else {
			return null;
		}
	}
}

