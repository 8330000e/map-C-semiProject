package kr.co.iei.region.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="region")
public class Region {
    private int regionNo;
    private String regionName;
    private int treeLevel;
    private int treeExp;
    private int totalPointUsed;
}