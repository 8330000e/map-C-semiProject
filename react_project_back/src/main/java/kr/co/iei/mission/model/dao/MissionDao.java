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
	
	int insertBasicMission(String memberId);
	
	int updateMemberPointForBasic(String memberId);

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

	
}
