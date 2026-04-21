package kr.co.iei.alarm.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.alarm.model.dao.AlarmDao;
import kr.co.iei.alarm.model.vo.Alarm;

@Service
public class AlarmService {
    @Autowired
    private AlarmDao alarmDao;

    @Transactional
    public int alarmAllCheck(String memberId) {
        int result = alarmDao.alarmAllCheck(memberId);
        return result;
    }

    public List<Alarm> selectAllAlarm(String memberId) {
        List<Alarm> list = alarmDao.selectAllAlarm(memberId);
        return list;
    }

    public int isNewAlarm(String memberId) {
        int result = alarmDao.isNewAlarm(memberId);
        return result;
    }

    @Transactional
    public int alarmChecked(String memberId) {
        int result = alarmDao.alarmChecked(memberId);
        return result;
    }

    @Transactional
    public int alarmDel(String memberId, Integer alarmNo) {
        int result = alarmDao.alarmDel(memberId, alarmNo);
        return result;
    }

    @Transactional
    public int alarmalldel(String memberId) {
        int result = alarmDao.alarmalldel(memberId);
        return result;
    }
}
