package kr.co.iei.board.model.dao;


import java.util.HashMap;
import java.util.List;


import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.BoardComment;
import kr.co.iei.board.model.vo.BoardFile;
import kr.co.iei.board.model.vo.BoardLike;
import kr.co.iei.board.model.vo.BoardReport;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;



@Mapper
public interface BoardDao {

	List<Board> selectBoardList(HashMap<String, Object> param);

	int insertBoard(Board board);

	int updateBoard(Board board);
	int incrementReadCount(@Param("boardNo") int boardNo);

	int insertBoardLike(@Param("boardNo") int boardNo, @Param("memberId") String memberId);

	int deleteBoardLike(@Param("boardNo") int boardNo, @Param("memberId") String memberId);

	int selectBoardLikeByMember(@Param("boardNo") int boardNo, @Param("memberId") String memberId);

	int insertBoardTip(@Param("boardNo") int boardNo, @Param("memberId") String memberId);

	int deleteBoardTip(@Param("boardNo") int boardNo, @Param("memberId") String memberId);

	int selectBoardTipByMember(@Param("boardNo") int boardNo, @Param("memberId") String memberId);

	int selectBoardAuthor(@Param("boardNo") int boardNo, @Param("writerId") String writerId);

	int deleteBoard(@Param("boardNo") int boardNo);

	int insertBoardFile(BoardFile boardFile);

	List<BoardComment> selectBoardComments(@Param("boardNo") int boardNo);

	int insertBoardComment(BoardComment comment);

	int updateBoardComment(BoardComment comment);

	int deleteBoardComment(@Param("commentNo") long commentNo, @Param("memberId") String memberId);

	List<BoardLike> bestBoardList();
	
	List<Board> selectMemberIdBoard(HashMap<String, Object> map);

	List<Integer> selectLikeBoard(String memberId);

	List<Integer> selectTipBoard(String memberId);

	List<Board> selectMarkers();

	int insertBoardReport(BoardReport report);

	int checkReport(BoardReport report);
    

}
