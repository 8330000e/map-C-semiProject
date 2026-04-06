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
	private Integer[] categoryCount;
	private Integer ad;
	private Integer hate;
	private Integer spam;
	private Integer etc;
	private Integer pendingReport;
	private Integer fourWeekAgo;
	private Integer threeWeekAgo;
	private Integer twoWeekAgo;
	private Integer oneWeekAgo;
	
}
