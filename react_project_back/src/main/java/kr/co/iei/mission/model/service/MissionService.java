package kr.co.iei.mission.model.service;

import java.io.File;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.member.model.service.MemberService;
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
	
	@Autowired
	private MemberService memberService;

	public List<Mission> selectMissionList() {
		return missionDao.selectMissionList();
	}

	@Transactional
	public Mission selectTodayRandomMission(String memberId) {
	    if (memberId == null || memberId.trim().isEmpty()) {
	        throw new IllegalArgumentException("memberId가 비어 있습니다.");
	    }

	    Mission todayMission = missionDao.selectTodayAssignedRandomMission(memberId);
	    if (todayMission != null) {
	        return todayMission;
	    }

	    Mission randomMission = missionDao.selectRandomMission();
	    if (randomMission == null) {
	        throw new RuntimeException("배정 가능한 랜덤 미션이 없습니다.");
	    }

	    MemberMission memberMission = new MemberMission();
	    memberMission.setMissionNo(randomMission.getMissionNo());
	    memberMission.setMemberId(memberId);

	    missionDao.insertMemberMission(memberMission);

	    Mission assignedMission = missionDao.selectTodayAssignedRandomMission(memberId);
	    if (assignedMission == null) {
	        throw new RuntimeException("랜덤 미션 조회 실패");
	    }

	    return assignedMission;
	}

	// 출석체크 포인트 지급
	@Transactional
	public Map<String, Object> checkAttendance(String memberId) {
	    int count = missionDao.existsTodayAttendance(memberId);

	    if (count > 0) {
	        return Map.of(
	            "result", -1,
	            "message", "이미 오늘 출석했습니다."
	        );
	    }

	    int result1 = missionDao.insertAttendance(memberId);
	    int result2 = missionDao.updateMemberPoint(memberId); // 기본 5포인트

	    if (result1 == 0 || result2 == 0) {
	        throw new RuntimeException("출석 처리 실패");
	    }
	    memberService.insertPointHistory(memberId, 5, "EARN", "출석체크");

	    List<String> attendanceDates = missionDao.selectRecentAttendanceDates(memberId);
	    int streak = calculateAttendanceStreak(attendanceDates);

	    int bonusPoint = 0;
	    if (streak == 3) {
	        bonusPoint = 10;
	    } else if (streak == 5) {
	        bonusPoint = 20;
	    } else if (streak == 7) {
	        bonusPoint = 30;
	    }

	    if (bonusPoint > 0) {
	        int bonusResult = missionDao.addAttendanceBonusPoint(memberId, bonusPoint);
	        if (bonusResult == 0) {
	            throw new RuntimeException("연속 출석 보너스 포인트 지급 실패");
	        }
	        
	        memberService.insertPointHistory(memberId, bonusPoint, "EARN", streak + "일 연속 출석 보너스");
	    }

	    HashMap<String, Object> result = new HashMap<>();
	    result.put("result", 1);
	    result.put("message", "출석 완료");
	    result.put("streak", streak);
	    result.put("basePoint", 5);
	    result.put("bonusPoint", bonusPoint);
	    result.put("totalPoint", 5 + bonusPoint);

	    return result;
	}
	
	
	
	private int calculateAttendanceStreak(List<String> attendanceDates) {
	    LocalDate today = LocalDate.now();
	    int streak = 0;

	    for (int i = 0; i < attendanceDates.size(); i++) {
	        LocalDate attendDate = LocalDate.parse(attendanceDates.get(i));

	        if (attendDate.equals(today.minusDays(i))) {
	            streak++;
	        } else {
	            break;
	        }
	    }

	    return streak;
	}

	@Transactional
	public int completeBasicMission(String memberId) {
	    int count = missionDao.existsTodayBasicMission(memberId);

	    if (count > 0) {
	        return -1;
	    }

	    // 기본 미션 완료 정보 INSERT 처리임.
	    int result1 = missionDao.insertBasicMission(memberId);

	    // 회원 포인트 정보 업데이트 처리임.
	    // MEMBER_POINT_TBL에 회원 정보가 없으면 UPDATE가 0건 처리될 수 있음.
	    int result2 = missionDao.updateMemberPointForBasic(memberId);

	    if (result2 == 0) {
	        // 회원 포인트 정보가 없어 UPDATE가 실패한 경우임.
	        // MEMBER_POINT_TBL에 기본 0원 포인트 행을 먼저 생성하고 재시도함.
	        int insertPointResult = missionDao.insertMemberPoint(memberId);
	        if (insertPointResult > 0) {
	            result2 = missionDao.updateMemberPointForBasic(memberId);
	        }
	    }

	    if (result1 == 0 || result2 == 0) {
	        throw new RuntimeException("기본 미션 포인트 지급 실패");
	    }
	    
	    memberService.insertPointHistory(memberId, 10, "EARN", "기본 미션 완료");

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
        String certImageUrl = savedFileName;
	    int result1 = missionDao.updateRandomMissionCertification(memberId, missionNo, certImageUrl);

	    if (result1 == 0) {
	        throw new RuntimeException("인증할 랜덤 미션 정보가 없습니다.");
	    }

	    int result2 = missionDao.updateMemberPointForRandom(memberId);

	    if (result2 == 0) {
	        throw new RuntimeException("랜덤 미션 포인트 지급 실패");
	    }
	    memberService.insertPointHistory(memberId, 20, "EARN", "랜덤 미션 완료");

	    return Map.of(
	        "result", 1,
	        "message", "랜덤 미션 인증 완료! 20포인트 지급",
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
		
		memberService.insertPointHistory(memberId, bonusMission.getRewardPoint(), "EARN", "보너스 미션 완료");

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



	public boolean isTodayAttendance(String memberId) {
	    int count = missionDao.existsTodayAttendance(memberId);
	    return count > 0;
	}
}