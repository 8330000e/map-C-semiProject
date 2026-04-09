package kr.co.iei.campaign.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="campPart")
public class CampaignParticipance {
	private Integer campaignParticipanceNo;
	private String campaignThumb;
	private String campaignMemo;
	private Integer campaignNo;
	private String campaignMemoUploadDate;
	private String campaignExpireDate;
	private String memberId;
	
}
