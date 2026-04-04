package kr.co.iei.board.model.dao;

import kr.co.iei.board.model.vo.Board;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BoardDao {
    int insertBoard(Board board);
}
