package kr.co.iei.admin.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="pr")
public class ProcessReport {
	private String boardAction;
	private String commentAction;
	private String memberAction;
	private String reason;
	private Integer reportNo;
	private Integer targetNo;
	private String targetId;
	private String memberId;
	private String lockReason;
	private String targetType;
	private String logAction;
}
