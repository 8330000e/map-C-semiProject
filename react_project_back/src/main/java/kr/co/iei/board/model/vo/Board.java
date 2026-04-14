package kr.co.iei.board.model.vo;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="board")
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Board {

	private Integer boardNo;
	 private String writerId;
	    private String boardTitle;
	    private String boardContent;
	    private String boardThumb;
	    private String boardDate;
	    private String memberNickname;
	    private String memberThumb;
	    private Integer boardStatus;
	    private Double boardLat;
	    private Double boardLng;
	    private Integer readCount;
	    private String ctpv;
	    private String sgg;
		private String addr;
	    // 게시글이 수정된 날짜를 담는 필드임.
	    // 수정할 때마다 DB에 SYSDATE로 저장해서 프론트에서 "수정됨" 표시를 할 수 있도록 함.
	    private String updatedAt;
	    
	    //ctpvsgg
	    private String ctpvsggId;
	    private Integer ctpvCd;
	    private Integer sggCd;
	    private String ctpvNm;
	    private String sggNm;
	 
	    
	    
	 // 프론트에서 바로 쓰기 위한 응답용 필드
	    private String writerNickname;
	    private String createDate;
	    private String thumbnailUrl;
	    private Integer likeCount;
	    private Integer commentCount;
	    
	    /*
	    private Long boardNo;
		private String writerId;
		private String boardTitle;
		private String boardContent;
		private String boardThumb;
		private String memberNickname;
		private Integer boardStatus;
		// Explicit setter for IDE/compiler compatibility
		public void setBoardStatus(int boardStatus)
		{ this.boardStatus = boardStatus; }
		public void setWriterId(String writerId)
		{ this.writerId = writerId; }
		public void setBoardTitle(String boardTitle)
		{ this.boardTitle = boardTitle; } 
		public void setBoardContent(String boardContent)
		{ this.boardContent = boardContent; }
		public void setBoardThumb(String boardThumb)
		{ this.boardThumb = boardThumb; }
		*/

    /*이거는 마이페이지 작업을 위한 거니 신경 안 쓰셔도 됩니다.*/
    private String searchBoard;
    private Integer filter;
    
    // 관리자용 
    private Integer reportCount;
    private String detectedKeyword;
}

