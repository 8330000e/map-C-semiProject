package kr.co.iei.board.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="report")
public class Report {
	private Integer reportNo;
	private Integer targetNo;
	private String targetType;
	private String memberId;
	private String reportCategory;
	private String reportContent;
	private String reportDate;
	private Integer reportStatus;
	private String targetTitle;
	private String targetId;
	private Integer reportCount;
}
