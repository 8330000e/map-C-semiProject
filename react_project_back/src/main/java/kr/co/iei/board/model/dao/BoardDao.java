package kr.co.iei.board.model.dao;


import java.util.HashMap;
import java.util.List;


import kr.co.iei.board.model.vo.Board;
import kr.co.iei.board.model.vo.BoardFile;
import kr.co.iei.board.model.vo.BoardLike;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;



@Mapper
public interface BoardDao {

	List<Board> selectBoardList(HashMap<String, Object> param);

	int insertBoard(Board board);

	int updateBoard(Board board);

	int deleteBoard(@Param("boardNo") int boardNo);

	int insertBoardFile(BoardFile boardFile);

	List<BoardLike> bestBoardList();
	
	List<Board> selectMemberIdBoard(HashMap<String, String> map);
    

}
