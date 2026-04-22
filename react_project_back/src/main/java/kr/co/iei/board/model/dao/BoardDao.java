package kr.co.iei.board.model.dao;


import java.util.HashMap;
import java.util.List;

import kr.co.iei.admin.model.vo.ProcessReport;
import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.BoardComment;
import kr.co.iei.board.model.vo.BoardFile;
import kr.co.iei.board.model.vo.BoardLike;
import kr.co.iei.board.model.vo.BoardReport;
import kr.co.iei.board.model.vo.Calco2;
import kr.co.iei.board.model.vo.Marker;
import kr.co.iei.board.model.vo.Report;
import kr.co.iei.member.model.vo.Member;

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

	int deleteBoardLikesByBoardNo(@Param("boardNo") int boardNo);

	int deleteBoardCommentsByBoardNo(@Param("boardNo") int boardNo);

	int deleteBoardTip(@Param("boardNo") int boardNo, @Param("memberId") String memberId);

	int deleteBoardTipsByBoardNo(@Param("boardNo") int boardNo);

	int deleteBoardFilesByBoardNo(@Param("boardNo") int boardNo);

	int deleteBoardReportsByBoardNo(@Param("boardNo") int boardNo);

	int selectBoardTipByMember(@Param("boardNo") int boardNo, @Param("memberId") String memberId);

    List<Board> selectTipBoardList();

	int selectBoardAuthor(@Param("boardNo") int boardNo, @Param("writerId") String writerId);

	int deleteBoard(@Param("boardNo") int boardNo);

	int insertBoardFile(BoardFile boardFile);

	String selectstpvsgg(String ctpv, String sgg);

	Integer addBoardNo();

	double selectCo2Tot(String ctpvsggId);

	int selectMemberCo2(Calco2 calco2);

	int insertCalco2Data(Calco2 calco2);

	int updateCo2(double membercalco2, String memberId);

	List<BoardComment> selectBoardComments(@Param("boardNo") int boardNo);

	BoardComment selectBoardCommentByNo(@Param("commentNo") Long commentNo);

	int insertBoardComment(BoardComment comment);

	int updateBoardComment(BoardComment comment);

	int deleteBoardComment(@Param("commentNo") long commentNo, @Param("memberId") String memberId);

	List<BoardLike> bestBoardList(HashMap<String, Object> param);
	
	List<Board> selectMemberIdBoard(HashMap<String, Object> map);

	List<Integer> selectLikeBoard(String memberId);

	List<Integer> selectTipBoard(String memberId);

	List<Marker> selectMarkers();

	int insertBoardReport(Report report);

	int checkReport(Report report);

	Board getBoardDetail(Integer boardNo);
	
	List<Board> selectCtpvsgg();

	List<Report> getReportList(String sortBy, String sortOrder, String type, String category, Integer status);

	// 지역별 게시글 개수를 조회하는 DAO 메서드임.
	// board_tbl과 store_board_tbl을 합쳐서 같은 ctpv/sgg 지역의 게시글 총합을 계산함.
	List<Board> selectBoardCount();

	List<Report> getGroupList(Integer targetNo, String targetType, Integer reportNo);

	

	

	

	

	



	

    

    

    

}
