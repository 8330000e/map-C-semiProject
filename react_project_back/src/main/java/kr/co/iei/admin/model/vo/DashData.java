package kr.co.iei.admin.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="dashdata")
public class DashData {
	private Integer totalMember;
	private Integer thisMonthMember;
	private Integer lastMonthMember;
	private Integer todayMember;
	private Integer yesterdayMember;
	 
}
