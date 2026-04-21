package kr.co.iei.alarm.model.vo;

import java.sql.Date;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="alarm")
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Alarm {
    private Integer alarmNo;
    private String memberId;
    private Integer alarmKind;
    private String alarmContent;
    private String alarmData;
    private Date alarmTime;
    private Integer alarmDel;
    private Integer pointNo;
}
