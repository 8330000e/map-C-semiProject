package kr.co.iei.alarm.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.alarm.model.dao.AlarmDao;

@Service
public class AlarmService {
    @Autowired
    private AlarmDao alarmDao;

    public int alarmAllCheck(String memberId) {
        int result = alarmDao.alarmAllCheck(memberId);
        return result;
    }
}
