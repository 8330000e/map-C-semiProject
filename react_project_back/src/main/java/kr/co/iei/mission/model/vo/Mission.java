package kr.co.iei.mission.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="mission")
public class Mission {
	private int missionNo;
    private String missionTitle;
    private int rewardPoint;
    private String missionImageUrl;
    private String missionType;
}
