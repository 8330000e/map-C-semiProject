package kr.co.iei.admin.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="notice")
public class Notice {
	private Integer noticeNo;
	private String noticeTitle;
	private String noticeContent;
	private String noticeDate;
	private Integer noticeView;
	private Integer noticePublic;
	private Integer noticeFixed;
	private String noticeCategory;
	private String noticeImagePath;
}
