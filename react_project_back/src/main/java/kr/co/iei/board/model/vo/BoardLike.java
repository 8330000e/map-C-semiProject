package kr.co.iei.board.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="boardLike")
public class BoardLike {
	private Integer boardNo;
	private Integer count;
	private String boardTitle;
	private String ctpv;
	private String sgg;
}
