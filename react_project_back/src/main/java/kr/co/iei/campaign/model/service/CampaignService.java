package kr.co.iei.campaign.model.service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import kr.co.iei.campaign.model.dao.CampaignDao;
import kr.co.iei.campaign.model.vo.Campaign;
import kr.co.iei.campaign.model.vo.CampaignNotice;
import kr.co.iei.campaign.model.vo.CampaignParticipance;

@Service
public class CampaignService {
	@Autowired
	private CampaignDao campaignDao;

	public Map<String, Object> selectAllCampaign(Map<String, Object> map) {
		Integer totalCount = campaignDao.selectAllCampaignCount();
		int size = (Integer)(map.get("size"));
		System.out.println(totalCount);
		int totalPage = (int)(Math.ceil((totalCount / (double)size)));
		System.out.println(totalPage);
		List<Campaign> list = campaignDao.selectAllCampaign(map);
		map.put("campList", list);
		map.put("totalPage", totalPage);
		return map;
	}

	public Campaign selectOneCampaign(Integer campaignNo) {
//		System.out.println(campaignNo);
		Campaign result = campaignDao.selectOneCampaign(campaignNo);
//		System.out.println(result.getMemberCount());
		return result;
	}

	@Transactional
	public int createCampaign(Campaign camp) {
		int campaignNo = campaignDao.selectCampaignNoSeq();
		camp.setCampaignNo(campaignNo);
		int result=0;
		result = campaignDao.createCampaign(camp);
		if(result==1) {
			result=campaignDao.insertIntoUpdateTbl(camp);
		}
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
	@Transactional
	public int inheritManager(Integer campaignNo) {
		String memberId= "admin00";
			Campaign camp = new Campaign();
			camp.setCampaignNo(campaignNo);
			camp.setMemberId(memberId);
			int result=campaignDao.inheritManager(camp);
		return result;
	}
	@Transactional
	public int banPartMember(Campaign camp) {
		int result=0;
		result=campaignDao.deletePartMember(camp);
		if(result==1) {
			System.out.println(camp.getCampaignExileReason());
			result = campaignDao.banPartMember(camp);
			if(result==1) {
				String alarmData = camp.getCampaignExileReason();
				String memberId = camp.getMemberId();
				System.out.println(memberId);
				System.out.println(alarmData);
				Map<String,String> map = new HashMap<String,String>();
				map.put("alarmData", alarmData);
				map.put("memberId", memberId);
				result = campaignDao.alarmBanMember(map);
			}
		
		}
		return result;
	}

	public int checkBannedMember(Campaign camp) {
		int campaignNo=camp.getCampaignNo();
		String currentId=camp.getMemberId();
		int result =0;
		List<String> bannedMembers= campaignDao.selectBannedMember(campaignNo);
		for(String memberId : bannedMembers) {
			if(currentId.equals(memberId)) {
				result=1;
				break;
			}
		}
		return result;
	}

	public Campaign selectCampForUpdate(Integer campaignNo) {
		Campaign camp = campaignDao.selectCampForUpdate(campaignNo);
		return camp;
	}
	@Transactional
	public int updateCamp(Campaign camp) {
		int result=0;
		result = campaignDao.campaignUpdateTblUpdate(camp);
		System.out.println(camp.getCampaignTitle());
		System.out.println(result);
		if(result==1) {
			int campaignStatus = campaignDao.getOnlyCampaignStatus(camp);
			System.out.println(campaignStatus);
			if(campaignStatus == 1) {
				return 1;
			}else {
				campaignStatus=1;
				camp.setCampaignStatus(campaignStatus);
				result=campaignDao.changeStatus(camp);
				System.out.println(result);
			}
		}
		return result;
	}

	public Map<String, Object> getNoticeList(Map<String, Integer> map) {
		int size=map.get("size");
		int totalCount = campaignDao.selectCampNoticeCount();
		int totalPage = (int)(Math.ceil(totalCount / (double)size));
		List<CampaignNotice> campNo = campaignDao.getNoticeList(map);
		Map<String , Object> returnMap =new HashMap<String,Object>();
		returnMap.put("campNo",campNo);
		returnMap.put("totalPage", totalPage);
		return returnMap;
	}
	@Transactional
	public int terminateCamp(Integer campaignNo) {
		int result=0;
		result = campaignDao.terminateCamp(campaignNo);
		if(result==1) {
			Campaign camp = campaignDao.selectOneCampaign(campaignNo);
			camp.setCampaignNo(campaignNo);
			String campTitle=camp.getCampaignTitle();
			String alarmContent = campTitle + "캠페인 조기종료";
			String alarmData = camp.getMemberId() + "가 부득이한 사정으로 "+campTitle +"을 종료했습니다.자세한 내용은 캠페인 내부 공지사항을 확인해주세요";
			List <String> partMembers = campaignDao.checkParticipanceMember(camp);
			for(String memberId : partMembers) {
				Map <String,String> map = new HashMap<String,String>();
				map.put("alarmContent", alarmContent);
				map.put("alarmData", alarmData);
				map.put("memberId", memberId);
				result = campaignDao.alarmTerminateCamp(map);	
			}
		}
		return result;
	}

	public int leaveMember(Campaign camp) {
		int result = campaignDao.deletePartMember(camp);
		return result;
	}

	public List<Campaign> selectFrontCamp() {
		List<Campaign> campList = campaignDao.selectFrontCamp();
		//자바에서 직접 짜르는 로직(비효율)
//		if(campList.size()>10) {
//			List<Campaign> list=campList.stream()
//					.skip(0)//생략가능!?(건너뛸지)
//					.limit(10)
//					.toList();
//			return list;
//		}
		return campList;
	}

	public List<CampaignNotice> selectOnlyFiveNotice() {
		List<CampaignNotice> campNo = campaignDao.selectOnlyFiveNotice();
		
		return campNo;
	}

	public CampaignNotice selectNoticeDetail(Integer campaignNoticeNo) {
		CampaignNotice campNo = campaignDao.selectNoticeDetail(campaignNoticeNo);
		return campNo;
	}
	

}
