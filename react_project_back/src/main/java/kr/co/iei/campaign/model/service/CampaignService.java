package kr.co.iei.campaign.model.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.campaign.model.dao.CampaignDao;
import kr.co.iei.campaign.model.vo.Campaign;
import kr.co.iei.campaign.model.vo.CampaignNotice;
import kr.co.iei.campaign.model.vo.CampaignParticipance;

@Service
public class CampaignService {
	@Autowired
	private CampaignDao campaignDao;

	public List<Campaign> selectAllCampaign(String campaignTitle) {
		List<Campaign> list = campaignDao.selectAllCampaign(campaignTitle);
		return list;
	}

	public Campaign selectOneCampaign(Integer campaignNo) {
//		System.out.println(campaignNo);
		Campaign result = campaignDao.selectOneCampaign(campaignNo);
//		System.out.println(result.getMemberCount());
		return result;
	}

	@Transactional
	public int createCampaign(Campaign camp) {
		int result = campaignDao.createCampaign(camp);
		return result;
	}

	public int checkParticipanceMember(Campaign c) {
		String memberId = c.getMemberId();
		int number = 0;
		List<String> list = campaignDao.checkParticipanceMember(c);
//		System.out.println(memberId);
//		System.out.println(list);
		for (String checkId : list) {
			if (checkId.equals(memberId)) {
				number = 1;
				break;
			} else {
				number = 0;
			}
		}
		return number;
	}

	@Transactional
	public int joinCampaign(Campaign camp) {
		int result = campaignDao.joinCampaign(camp);
		return result;
	}

	@Transactional
	public int changeStatus(Campaign camp2) {
		int result = campaignDao.changeStatus(camp2);
		return result;
	}

	@Transactional
	public int insertMemo(CampaignParticipance campPart) {
		Integer campaignNo = campPart.getCampaignNo();
		Campaign camp = campaignDao.selectOneCampaign(campaignNo);
		campPart.setCampaignExpireDate((camp.getCampaignExpireDate()));
		System.out.println(campPart);
		int result = campaignDao.insertMemo(campPart);
		return result;
	}

	public List<CampaignParticipance> getCampBoardList(Integer campaignNo) {
		List<CampaignParticipance> campPart = campaignDao.getCampBoardList(campaignNo);
		return campPart;
	}

	public CampaignParticipance getCampBoardDetail(Integer campaignParticipanceNo) {
		CampaignParticipance campPart = campaignDao.getCampBoardDetail(campaignParticipanceNo);
		return campPart;
	}

	@Transactional
	public int updateParticipanceBoard(CampaignParticipance campPart) {
		int result = campaignDao.updateParticipanceBoard(campPart);
		return result;
	}

	@Transactional
	public String deleteBoardMemo(Integer campaignParticipnaceNo) {
		CampaignParticipance campPart = campaignDao.getCampBoardDetail(campaignParticipnaceNo);
		String deletePath = campPart.getCampaignThumb();
		int result = campaignDao.deleteBoardMemo(campaignParticipnaceNo);
		if (result == 1) {
			return deletePath;
		} else {
			return "f";
		}
	}
	@Transactional
	public void givePartPoint(Map<String, Integer> map1) {
		int campaignNo=map1.get("campaignNo");
		int pointChange = map1.get("pointChange");
		Campaign camp = new Campaign();
		camp.setCampaignNo(campaignNo);
		List<String> memberList = campaignDao.checkParticipanceMember(camp);
		for(String memberId:memberList) {
			int currentPoint=campaignDao.getTotalPoint(memberId);
//			int totalPoint = currentPoint + pointChange;
			Map<String ,Object> map2 = new HashMap<String,Object>();
			map2.put("memberId", memberId);
			map2.put("pointChange", pointChange);
			campaignDao.insertPointState(map2);
//			map2.put("totalPoint",totalPoint);
			campaignDao.updatePoint(map2);//total_point = total_point + #{pointChange}
		}
	}
	@Transactional
	public void giveManagerPoint(Map<String, Object> map) {
		String memberId = (map.get("memberId")).toString();
		int pointChange = (Integer) (map.get("pointChange"));
		int currentPoint = campaignDao.getTotalPoint(memberId);
//		int totalPoint = currentPoint + pointChange;
		campaignDao.insertPointState(map);
//		map.put("totalPoint", totalPoint);
		campaignDao.updatePoint(map);//total_point = total_point + #{pointChange}

	}
	@Transactional
	public int insertCampNotice(CampaignNotice campNotice) {
		int result = campaignDao.insertCampNotice(campNotice);
		return result;
	}

}
