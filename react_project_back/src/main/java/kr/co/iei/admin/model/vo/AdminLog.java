package kr.co.iei.admin.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="adminLog")
public class AdminLog {
	
	
	private Integer suspendDays;
	
	
	private Integer logNo;
	private String adminId;
	private String logTargetId;
	private String logResult;
	private String logDate;
	private String logReason;
	private Integer reportNo;
	private String logAction;
	
}
