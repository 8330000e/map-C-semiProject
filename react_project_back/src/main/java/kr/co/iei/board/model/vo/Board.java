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
	 private String writerId;
	    private String boardTitle;
	    private String boardContent;
	    private String boardThumb;
	    private String boardDate;
	    private String memberNickname;
	    private Integer boardStatus;
	    private Double boardLat;
	    private Double boardLng;
	    private Integer readCount;
	    
	    
	 // 프론트에서 바로 쓰기 위한 응답용 필드
	    private String writerNickname;
	    private String createDate;
	    private String thumbnailUrl;
	    private Integer likeCount;
	    private Integer commentCount;
}
