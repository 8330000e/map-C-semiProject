package kr.co.iei.campaign.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.campaign.model.dao.CampaignDao;
import kr.co.iei.campaign.model.vo.Campaign;

@Service
public class CampaignService {
	@Autowired
	private CampaignDao campaignDao;

	public List<Campaign> selectAllCampaign(String campaignTitle) {
		List<Campaign> list = campaignDao.selectAllCampaign(campaignTitle);
		return list;
	}

	public Campaign selectOneCampaign(Integer campaignNo) {
		System.out.println(campaignNo);
		Campaign result = campaignDao.selectOneCampaign(campaignNo);
		System.out.println(result.getMemberCount());
		return result;
	}
	@Transactional
	public int createCampaign(Campaign camp) {
		int result = campaignDao.createCampaign(camp);
		return result;
	}
}
