package kr.co.iei.alarm.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.alarm.model.dao.AlarmDao;
import kr.co.iei.alarm.model.vo.Alarm;

@Service
public class AlarmService {
    @Autowired
    private AlarmDao alarmDao;

    public int alarmAllCheck(String memberId) {
        int result = alarmDao.alarmAllCheck(memberId);
        return result;
    }

    public List<Alarm> selectAllAlarm(String memberId) {
        List<Alarm> list = alarmDao.selectAllAlarm(memberId);
        return list;
    }
}
