package kr.co.iei.campaign.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@NoArgsConstructor
@AllArgsConstructor
@Alias(value="camp")
@Data
public class Campaign {
	private Integer campaignNo;
	private String campaignTitle;
	private String campaignExplanation;
	private Integer campaignStatus;
	private Integer campaignGoalMember;
	private String campaignExpireDate;
	private String campaignStartDate;
	private String memberId;
	private Integer memberCount;
}
