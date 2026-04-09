package kr.co.iei.mission.model.service;

import java.io.File;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.mission.model.dao.MissionDao;
import kr.co.iei.mission.model.vo.MemberMission;
import kr.co.iei.mission.model.vo.Mission;
import kr.co.iei.utils.FileUtils;

@Service
public class MissionService {
	@Autowired
	MissionDao missionDao;
	
	@Value("${file.root}")
	private String root;

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

	// 출석체크 포인트 지급
	public int checkAttendance(String memberId) {
		int count = missionDao.existsTodayAttendance(memberId);

	    if (count > 0) {
	        return -1;
	    }

	    int result1 = missionDao.insertAttendance(memberId);
	    int result2 = missionDao.updateMemberPoint(memberId);

	    if (result1 == 0 || result2 == 0) {
	        throw new RuntimeException("출석 처리 실패");
	    }

	    return 1;
	}

	public boolean isTodayAttendance(String memberId) {
		int count = missionDao.existsTodayAttendance(memberId);
		return count > 0;
	}

	@Transactional
	public int completeBasicMission(String memberId) {
	    int count = missionDao.existsTodayBasicMission(memberId);

	    if (count > 0) {
	        return -1;
	    }

	    int result1 = missionDao.insertBasicMission(memberId);
	    int result2 = missionDao.updateMemberPointForBasic(memberId);

	    if (result1 == 0 || result2 == 0) {
	        throw new RuntimeException("기본 미션 포인트 지급 실패");
	    }

	    return 1;
	}

	public boolean isTodayBasicMission(String memberId) {
		int count = missionDao.existsTodayBasicMission(memberId);
	    return count > 0;
	}

	public boolean isTodayRandomMissionCompleted(String memberId, int missionNo) {
		int count = missionDao.existsTodayRandomMissionComplete(memberId, missionNo);
		return count > 0;
	}

	@Transactional
	public Map<String, Object> certifyRandomMission(String memberId, int missionNo, MultipartFile certImage) {
	    int count = missionDao.existsTodayRandomMissionComplete(memberId, missionNo);

	    if (count > 0) {
	        return Map.of(
	            "result", -1,
	            "message", "이미 오늘 랜덤 미션을 완료했습니다."
	        );
	    }

	    File saveDir = new File(new File(root), "mission/random");
	    if (!saveDir.exists()) {
	        saveDir.mkdirs();
	    }

	    String savedFileName = FileUtils.upload(saveDir.getAbsolutePath() + File.separator, certImage);
	    String certImageUrl = "/uploads/mission/random/" + savedFileName;

	    int result1 = missionDao.updateRandomMissionCertification(memberId, missionNo, certImageUrl);

	    if (result1 == 0) {
	        throw new RuntimeException("인증할 랜덤 미션 정보가 없습니다.");
	    }

	    int result2 = missionDao.updateMemberPointForRandom(memberId);

	    if (result2 == 0) {
	        throw new RuntimeException("랜덤 미션 포인트 지급 실패");
	    }

	    return Map.of(
	        "result", 1,
	        "message", "랜덤 미션 인증 완료! 10포인트 지급",
	        "certImageUrl", certImageUrl
	    );
	}

	public boolean isTodayBonusMission(String memberId) {
		int count = missionDao.existsTodayBonusMission(memberId);
		return count > 0;
	}

	@Transactional
	public int claimBonusMission(String memberId, int missionNo) {
		// 1. 오늘 기본 미션 완료 여부 확인
		int basicCount = missionDao.existsTodayBasicMission(memberId);
		if (basicCount == 0) {
			return -1;
		}

		// 2. 오늘 랜덤 미션 완료 여부 확인
		int randomCount = missionDao.existsTodayCompletedRandomMission(memberId);
		if (randomCount == 0) {
			return -1;
		}

		// 3. 오늘 보너스 미션 중복 수령 여부 확인
		int bonusCount = missionDao.existsTodayBonusMission(memberId);
		if (bonusCount > 0) {
			return -2;
		}

		// 4. 요청한 missionNo가 실제 BONUS 미션인지 확인
		Mission bonusMission = missionDao.selectMissionByMissionNo(missionNo);
		if (bonusMission == null || !"BONUS".equals(bonusMission.getMissionType())) {
			return -3;
		}

		// 5. 보너스 미션 완료 insert
		int result1 = missionDao.insertBonusMission(memberId, missionNo);
		if (result1 == 0) {
			throw new RuntimeException("보너스 미션 저장 실패");
		}

		// 6. 보너스 포인트 지급
		int result2 = missionDao.updateMemberPointForBonus(memberId, bonusMission.getRewardPoint());
		if (result2 == 0) {
			throw new RuntimeException("보너스 포인트 지급 실패");
		}

		return 1;
	}

	public Map<String, Object> getTodayRandomMissionStatus(String memberId, int missionNo) {
	    int count = missionDao.existsTodayRandomMissionComplete(memberId, missionNo);
	    String certImageUrl = "";

	    if (count > 0) {
	        certImageUrl = missionDao.selectTodayRandomMissionCertImageUrl(memberId, missionNo);
	    }

	    return Map.of(
	        "completed", count > 0,
	        "certImageUrl", certImageUrl == null ? "" : certImageUrl
	    );
	}
}