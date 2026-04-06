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

	// Explicit setter for IDE/compiler compatibility
	public void setBoardStatus(int boardStatus) {
		this.boardStatus = boardStatus;
	}

	public void setWriterId(String writerId) {
		this.writerId = writerId;
	}

	public void setBoardTitle(String boardTitle) {
		this.boardTitle = boardTitle;
	}

	public void setBoardContent(String boardContent) {
		this.boardContent = boardContent;
	}

	public void setBoardThumb(String boardThumb) {
		this.boardThumb = boardThumb;
	}
}