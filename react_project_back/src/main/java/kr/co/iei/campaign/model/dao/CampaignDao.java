package kr.co.iei.campaign.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.campaign.model.vo.Campaign;

@Mapper
public interface CampaignDao {

	List<Campaign> selectAllCampaign(String campaignTitle);

	Campaign selectOneCampaign(Integer campaignNo);

	int createCampaign(Campaign camp);

	List<String> checkParticipanceMember(Campaign c);

	int joinCampaign(Campaign camp);

}
