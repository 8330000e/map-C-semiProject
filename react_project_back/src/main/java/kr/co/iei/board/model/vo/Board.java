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
	private Long boardNo;
	private String writerId;
	private String boardTitle;
	private String boardContent;
	private String boardThumb;
	private String memberNickname;
	private Integer boardStatus;
}
