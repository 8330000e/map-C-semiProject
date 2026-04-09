package kr.co.iei.board.model.service;

import java.io.File;
import java.util.ArrayList;
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
	public HashMap<String, Object> insertBoard(Board board) {
	    HashMap<String, Object> resultMap = new HashMap<>();

	    int result = boardDao.insertBoard(board);

	    boolean pointAwarded = false;

	    if (result > 0) {
	        int missionResult = missionService.completeBasicMission(board.getWriterId());
	        pointAwarded = missionResult == 1;
	    }

	    resultMap.put("boardNo", board.getBoardNo());
	    resultMap.put("pointAwarded", pointAwarded);
	    resultMap.put("result", result);

	    return resultMap;
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

	// 댓글 목록 조회 기능임. 게시글 번호로 댓글 리스트를 가져옴.
	//  - BoardDao.selectBoardComments()를 통해 DB에서 데이터를 읽어옴.
	//  - 반환된 값은 상세 페이지에서 댓글 렌더링에 쓰임.
	public List<BoardComment> getBoardComments(int boardNo) {
		return boardDao.selectBoardComments(boardNo);
	}

	// 댓글 등록 기능임. 새 댓글을 DB에 저장하고 저장된 댓글 객체를 리턴함.
	//  - 댓글 번호는 MyBatis selectKey로 자동 생성됨.
	//  - 부모 댓글 번호가 있으면 대댓글로 저장됨.
	public BoardComment addBoardComment(BoardComment comment) {
		boardDao.insertBoardComment(comment);
		return comment;
	}

	// 댓글 수정 기능임. 댓글 내용을 변경해서 DB에 반영함.
	public int editBoardComment(BoardComment comment) {
		return boardDao.updateBoardComment(comment);
	}

	// 댓글 삭제 기능임. 해당 사용자의 댓글을 DB에서 지움.
	public int removeBoardComment(long commentNo, String memberId) {
		return boardDao.deleteBoardComment(commentNo, memberId);
	}

	public boolean isBoardLiked(int boardNo, String memberId) {
		return boardDao.selectBoardLikeByMember(boardNo, memberId) > 0;
	}

	// 스크랩 추가 기능임. 이미 같은 사람이 스크랩했으면 또 추가 안 함.
	public int addBoardTip(int boardNo, String memberId) {
		if (isBoardTiped(boardNo, memberId)) {
			return 0;
		}
		return boardDao.insertBoardTip(boardNo, memberId);
	}

	// 스크랩 삭제 기능임. tip_tbl에서 이 회원의 스크랩 기록을 지움.
	public int removeBoardTip(int boardNo, String memberId) {
		return boardDao.deleteBoardTip(boardNo, memberId);
	}

	// 스크랩 여부 확인 기능임. 이 회원이 이 게시물을 스크랩했는지 확인함.
	public boolean isBoardTiped(int boardNo, String memberId) {
		return boardDao.selectBoardTipByMember(boardNo, memberId) > 0;
	}

	public boolean isBoardAuthor(int boardNo, String writerId) {
		return boardDao.selectBoardAuthor(boardNo, writerId) > 0;
	}
	// 게시글 첨부파일 저장 기능임. 여러 파일을 서버에 업로드하고 DB에 경로를 저장함.
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
			String memberId = map.get("memberId").toString();
			List<Integer> boardNoList = boardDao.selectLikeBoard(memberId);
			// 좋아요한 게시글 ID 목록이 없으면
			// 쿼리 조건에 넣을 값이 없어서 잘못된 조회가 될 수 있음.
			// 그래서 빈 목록이면 바로 빈 결과를 반환함.
			if (boardNoList == null || boardNoList.isEmpty()) {
				return new ArrayList<>();
			}
			map.put("boardNoList", boardNoList);
			System.out.println(boardNoList);
			List<Board> list = boardDao.selectMemberIdBoard(map);
			return list;
		}
		if(checker == 3) {
			String memberId = map.get("memberId").toString();
			List<Integer> tipList = boardDao.selectTipBoard(memberId);
			// 스크랩한 게시글 ID 목록이 없으면
			// 조건에 들어갈 값이 없어서 잘못된 조회가 될 수 있음.
			// 그래서 빈 목록이면 바로 빈 결과를 반환함.
			if (tipList == null || tipList.isEmpty()) {
				return new ArrayList<>();
			}
			map.put("tipList", tipList);
			System.out.println(tipList);
			List<Board> list = boardDao.selectMemberIdBoard(map);
			return list;
		}
		else {
			return null;
		}
	}
	public List<Board> selectMarkers() {
		List<Board> list = boardDao.selectMarkers();
		return list;
	}
}

