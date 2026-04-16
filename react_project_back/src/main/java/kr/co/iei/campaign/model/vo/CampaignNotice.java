package kr.co.iei.campaign.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="campNo")
public class CampaignNotice {
	private Integer campaignNoticeNo;
	private String campaignNoticeTitle;
	private String campaignNoticeContent;
	private String campaignNoticeWriter;
	private Integer campaignNo;
	private String campaignNoticeDate;
	private String campaignTitle;
}
