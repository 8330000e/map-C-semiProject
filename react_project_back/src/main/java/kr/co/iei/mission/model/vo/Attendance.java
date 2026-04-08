package kr.co.iei.mission.model.vo;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attendance {
    private int attendanceNo;
    private String memberId;
    private Date attendYmd;
    private int rewardPoint;
}