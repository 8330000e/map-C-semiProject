package kr.co.iei.region.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("contribution")
public class RegionContribution {
    private int contributionNo;
    private String memberId;
    private int regionNo;
    private int contributedPoint;
    private String contributedAt;
    private String regionName;
}