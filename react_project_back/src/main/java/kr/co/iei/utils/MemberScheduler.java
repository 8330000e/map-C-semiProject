package kr.co.iei.utils;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;



import kr.co.iei.member.model.dao.MemberDao;

@Component
public class MemberScheduler {
	@Autowired
	private MemberDao memberDao;
	
	@Scheduled(fixedRate = 60000)
	public void unlockExpiredMembers() {
		System.out.println("회원 상태변경 스케줄러 실행 " + new Date());
		memberDao.unlockExpiredMembers();
	}
}
