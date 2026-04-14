package kr.co.iei.board.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="marker")
public class Marker {
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

        //ctpvsgg
	    private String ctpvsggId;
	    private Integer ctpvCd;
	    private Integer sggCd;
	    private String ctpvNm;
	    private String sggNm;

        private Integer boardCount;
}
