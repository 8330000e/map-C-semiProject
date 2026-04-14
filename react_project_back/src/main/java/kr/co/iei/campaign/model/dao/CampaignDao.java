package kr.co.iei.campaign.model.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.campaign.model.vo.Campaign;
import kr.co.iei.campaign.model.vo.CampaignNotice;
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

	CampaignParticipance getCampBoardDetail(Integer campaignParticipanceNo);

	int updateParticipanceBoard(CampaignParticipance campPart);

	int deleteBoardMemo(Integer campaignParticipnaceNo);

	int getTotalPoint(String memberId);

	int updatePoint(String memberId);

	void insertPointState(Map<String, Object> map);

	void updatePoint(Map<String, Object> map);

	int insertCampNotice(CampaignNotice campNotice);

	

}
