package kr.co.iei.campaign.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.campaign.model.vo.Campaign;
import kr.co.iei.campaign.model.vo.CampaignParticipance;

@Mapper
public interface CampaignDao {

	List<Campaign> selectAllCampaign(String campaignTitle);

	Campaign selectOneCampaign(Integer campaignNo);

	int createCampaign(Campaign camp);

	List<String> checkParticipanceMember(Campaign c);

	int joinCampaign(Campaign camp);

	int changeStatus(Campaign camp2);

	List<Campaign> selectCampaignStatus();

	int insertMemo(CampaignParticipance campPart);

	List<CampaignParticipance> getCampBoardList(Integer campaignNo);

}
