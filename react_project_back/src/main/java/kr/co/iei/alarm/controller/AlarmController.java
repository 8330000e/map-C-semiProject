package kr.co.iei.alarm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.alarm.model.service.AlarmService;
import kr.co.iei.alarm.model.vo.Alarm;

@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"})
@RestController
@RequestMapping(value="/alarms")
public class AlarmController {
    @Autowired
    private AlarmService alarmService;

    @PatchMapping(value = "/checked")
    public ResponseEntity<?> alarmAllCheck(@RequestParam String memberId) {
        int result = alarmService.alarmAllCheck(memberId);
        return ResponseEntity.ok(result);
    }

    @GetMapping(value = "/{memberId}")
    public ResponseEntity<?> selectAllAlarm(@PathVariable String memberId) {
        List<Alarm> list = alarmService.selectAllAlarm(memberId);
        return ResponseEntity.ok(list);
    }
}
