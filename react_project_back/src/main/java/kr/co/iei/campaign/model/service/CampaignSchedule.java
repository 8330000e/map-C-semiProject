package kr.co.iei.campaign.model.service;

//import java.text.DateFormat;
//import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
//import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.campaign.model.dao.CampaignDao;
import kr.co.iei.campaign.model.vo.Campaign;

@Transactional
@Component
public class CampaignSchedule {	
	//return,매개변수 X (독립적으로 돌아가는 객체이기 때문)
	
	@Autowired
	private CampaignService campaignService;
	@Autowired
	private CampaignDao campaignDao;
	
	
	//cron (초, 분 , 시, 일자, 월, 요일(0~6(일요일은 0과7이 혼용?인듯함){요일 지정시 일자나 월 특정으로 지정시 혼동 가능(예를 들어서 9일을 지정하고 수요일을 지정,9일은 수요일이 아닐때)}))
	//@Scheduled(fixedDelay = 3000)
	@Scheduled(cron="0 0 9 * * *")
	public void test() {
//		System.out.println(1);
		List<Campaign> campList = campaignDao.selectCampaignStatus(); 
//		System.out.println(campList);
		for (Campaign camp : campList) {
			int campaignNo=camp.getCampaignNo();
			int campStatus=camp.getCampaignStatus();
			String campExpireDate=camp.getCampaignExpireDate();
			String memberId = camp.getMemberId();
			int campGoalMember=camp.getCampaignGoalMember();
			int memberCount = camp.getMemberCount();
			Date current = new Date();
			long now = current.getTime();
			

			DateTimeFormatter formatter =
			    DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

			int changeStatus;
			//문자열을 localDateTime 객체로 변환
			LocalDateTime ldt = LocalDateTime.parse(campExpireDate, formatter);
			long expire = ldt
			    .atZone(ZoneId.systemDefault())//시스템 시간대
			    .toInstant()//utc기준 절대시간
			    .toEpochMilli();//밀리초(1970)
			if(expire-now<0 && campStatus ==2) {
				if(memberCount >= campGoalMember) {
					changeStatus = 3;
					//멤버들에게 포인트 주는 로직
					int successPoint=memberCount * 15;
					int partPoint = 100;
					Map<String, Object> map = new HashMap<String, Object>();
					map.put("memberId", memberId);
					map.put("pointChange", successPoint);
					campaignService.giveManagerPoint(map);
					Map<String,Integer> map1 = new HashMap<String,Integer>();
					map1.put("campaignNo", campaignNo);
					map1.put("pointChange", partPoint);
					campaignService.givePartPoint(map1);
				}else {
					changeStatus = 4;
				}
				Campaign camp2 = new Campaign();
				camp2.setCampaignNo(campaignNo);
				camp2.setCampaignStatus(changeStatus);
				int result =campaignService.changeStatus(camp2);
				if(result ==1) {
					System.out.println("success");
				}else {
					System.out.println("error");
				}
			}
			
		}
		
	}
}
