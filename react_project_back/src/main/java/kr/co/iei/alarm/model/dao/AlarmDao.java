package kr.co.iei.alarm.model.dao;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AlarmDao {

    int alarmAllCheck(String memberId);
    
}
