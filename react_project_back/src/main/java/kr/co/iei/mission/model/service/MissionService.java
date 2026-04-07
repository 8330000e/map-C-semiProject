package kr.co.iei.mission.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.mission.model.dao.MissionDao;
import kr.co.iei.mission.model.vo.MemberMission;
import kr.co.iei.mission.model.vo.Mission;

@Service
public class MissionService {
	@Autowired
	MissionDao missionDao;

	public List<Mission> selectMissionList() {
		return missionDao.selectMissionList();
	}

	@Transactional
	public Mission selectTodayRandomMission(String memberId) {

		// 1. 오늘 이미 배정된 랜덤 미션 조회
		Mission todayMission = missionDao.selectTodayAssignedRandomMission(memberId);

		if (todayMission != null) {
			return todayMission;
		}

		// 2. 오늘 배정된 게 없으면 랜덤 미션 하나 뽑기
		Mission randomMission = missionDao.selectRandomMission();

		if (randomMission == null) {
			return null;
		}

		// 3. 회원 미션 배정 테이블에 insert
		MemberMission memberMission = new MemberMission();
		memberMission.setMissionNo(randomMission.getMissionNo());
		memberMission.setMemberId(memberId);
		memberMission.setCertImageUrl(null);

		missionDao.insertMemberMission(memberMission);
		// 4. 뽑은 랜덤 미션 반환
		return randomMission;
	}

}
