package kr.co.iei.mission.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.iei.mission.model.vo.MemberMission;
import kr.co.iei.mission.model.vo.Mission;

@Mapper
public interface MissionDao {

	List<Mission> selectMissionList();

	Mission selectTodayAssignedRandomMission(String memberId);

	Mission selectRandomMission();

	void insertMemberMission(MemberMission memberMission);

	int existsTodayAttendance(String memberId);

	int insertAttendance(String memberId);

	int updateMemberPoint(String memberId);

	int existsTodayBasicMission(String memberId);
	
	// 기본 미션 완료 정보 INSERT 처리임.
	int insertBasicMission(String memberId);
	
	// 기본 미션 성공 시 회원 포인트를 5점 적립함.
	int updateMemberPointForBasic(String memberId);
	
	// MEMBER_POINT_TBL에 해당 회원 행이 없을 때 기본 0포인트 행 생성 처리임.
	int insertMemberPoint(String memberId);

	int existsTodayRandomMissionComplete(
	        @Param("memberId") String memberId,
	        @Param("missionNo") int missionNo
	);

	int updateRandomMissionCertification(
	        @Param("memberId") String memberId,
	        @Param("missionNo") int missionNo,
	        @Param("certImageUrl") String certImageUrl
	);

	int updateMemberPointForRandom(@Param("memberId") String memberId);

	int existsTodayBonusMission(String memberId);

	int existsTodayCompletedRandomMission(String memberId);

	Mission selectMissionByMissionNo(int missionNo);

	int insertBonusMission(
		    @Param("memberId") String memberId,
		    @Param("missionNo") int missionNo
		);

		int updateMemberPointForBonus(
		    @Param("memberId") String memberId,
		    @Param("rewardPoint") int rewardPoint
		);

		String selectTodayRandomMissionCertImageUrl(
			    @Param("memberId") String memberId,
			    @Param("missionNo") int missionNo
			);

		List<String> selectRecentAttendanceDates(String memberId);

		int addAttendanceBonusPoint(String memberId, int bonusPoint);

	
}
