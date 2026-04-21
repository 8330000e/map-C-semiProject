package kr.co.iei.alarm.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.alarm.model.vo.Alarm;

@Mapper
public interface AlarmDao {

    int alarmAllCheck(String memberId);

    List<Alarm> selectAllAlarm(String memberId);

    int isNewAlarm(String memberId);

    int alarmChecked(String memberId);

    int alarmDel(String memberId, Integer alarmNo);

    int alarmalldel(String memberId);
    
}
