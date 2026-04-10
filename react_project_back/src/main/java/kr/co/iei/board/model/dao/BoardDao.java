package kr.co.iei.board.model.dao;


import java.util.HashMap;
import java.util.List;


import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.BoardComment;
import kr.co.iei.board.model.vo.BoardFile;
import kr.co.iei.board.model.vo.BoardLike;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;



@Mapper
public interface BoardDao {

	// 이 인터페이스는 MyBatis와 연결되어 SQL 매퍼에 정의된 쿼리를 호출함.
	// Java 메서드 이름과 매퍼의 id가 매핑되어 SQL이 실행됨.
	List<Board> selectBoardList(HashMap<String, Object> param);

	// 게시글 추가 SQL 호출.
	int insertBoard(Board board);

	// 게시글 수정 SQL 호출.
	int updateBoard(Board board);
	int incrementReadCount(@Param("boardNo") int boardNo);

	int insertBoardLike(@Param("boardNo") int boardNo, @Param("memberId") String memberId);

	int deleteBoardLike(@Param("boardNo") int boardNo, @Param("memberId") String memberId);

	int selectBoardLikeByMember(@Param("boardNo") int boardNo, @Param("memberId") String memberId);

	int insertBoardTip(@Param("boardNo") int boardNo, @Param("memberId") String memberId);

	int deleteBoardTip(@Param("boardNo") int boardNo, @Param("memberId") String memberId);

	int selectBoardTipByMember(@Param("boardNo") int boardNo, @Param("memberId") String memberId);

    List<Board> selectTipBoardList();

	int selectBoardAuthor(@Param("boardNo") int boardNo, @Param("writerId") String writerId);

	int deleteBoard(@Param("boardNo") int boardNo);

	int insertBoardFile(BoardFile boardFile);

	List<BoardComment> selectBoardComments(@Param("boardNo") int boardNo);

	int insertBoardComment(BoardComment comment);

	int updateBoardComment(BoardComment comment);

	int deleteBoardComment(@Param("commentNo") long commentNo, @Param("memberId") String memberId);

	List<BoardLike> bestBoardList(HashMap<String, Object> param);
	
	List<Board> selectMemberIdBoard(HashMap<String, Object> map);

	List<Integer> selectLikeBoard(String memberId);

	List<Integer> selectTipBoard(String memberId);

	List<Board> selectMarkers();
    

}
