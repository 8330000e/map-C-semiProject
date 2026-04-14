package kr.co.iei.point.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "pointHistory")
public class PointHistory {
    private int pointNo;
    private String memberId;
    private int pointChange;
    private String pointType;
    private String pointReason;
    private String createdDate;
}