package kr.co.iei.point.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "point")
public class Point {
	private Integer pointNo;
	private String memberId;
	private String pointChange;
	private String pointType;
	private Date endDate;
	
	private Integer totalPoint;
}
