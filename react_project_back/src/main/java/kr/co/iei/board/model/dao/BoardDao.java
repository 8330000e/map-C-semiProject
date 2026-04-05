package kr.co.iei.board.model.dao;


import java.util.HashMap;
import java.util.List;


import kr.co.iei.board.model.vo.Board;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.board.model.vo.Board;

@Mapper
public interface BoardDao {

	List<Board> selectBoardList(HashMap<String, Object> param);

	int insertBoard(Board board);

	int updateBoard(Board board);

	int deleteBoard(int boardNo);


    int insertBoard(Board board);

}
