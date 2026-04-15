package kr.co.iei.admin.model.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProcessReport {
	private String boardAction;
	private String memberAction;
	private String reason;
	private Integer reportNo;
	private Integer targetNo;
	private String targetId;
	private String memberId;
}
