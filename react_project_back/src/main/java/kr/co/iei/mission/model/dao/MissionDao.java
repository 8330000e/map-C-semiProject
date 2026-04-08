package kr.co.iei.mission.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

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

}
