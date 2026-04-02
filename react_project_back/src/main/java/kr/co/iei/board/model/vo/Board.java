package kr.co.iei.board.model.vo;

import org.apache.ibatis.type.Alias;

import kr.co.iei.member.model.vo.Member;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="board")
public class Board {
	private Integer boardNo;
}
