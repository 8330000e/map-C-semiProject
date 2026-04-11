package kr.co.iei.admin.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="log")
public class Log {
	private Integer memberLogNo;
	private String memberId;
	private String logIp;
	private String logTime;
	private String logAction;
	private String logDetail;
	private String logDevice;
	private String logLocation;
	private Integer logResult;
}
