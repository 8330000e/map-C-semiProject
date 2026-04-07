package kr.co.iei.mission.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "memberMission")
public class MemberMission {
	private int userMissionNo;
    private int missionNo;
    private String memberId;
    private String completedYmd;
    private String certImageUrl;
}
