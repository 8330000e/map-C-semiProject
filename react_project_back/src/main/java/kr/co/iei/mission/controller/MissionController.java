package kr.co.iei.mission.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.mission.model.service.MissionService;
import kr.co.iei.mission.model.vo.Mission;


@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"})
@RestController
@RequestMapping(value="/missions")
public class MissionController {
	@Autowired
	MissionService missionService;
	
	
	//전체 미션 조회
	@GetMapping
	public List<Mission> selectMissionList() {
	    return missionService.selectMissionList();
	}
	// 오늘의 랜덤 미션 조회
    @GetMapping("/random")
    public Mission selectTodayRandomMission(@RequestParam String memberId) {
        return missionService.selectTodayRandomMission(memberId);
    }
    
    @PostMapping("/attendance/check")
    public ResponseEntity<Map<String, String>> checkAttendance(@RequestBody Map<String, String> param) {
        String memberId = param.get("memberId");

        int result = missionService.checkAttendance(memberId);

        if (result == -1) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "이미 오늘 출석체크를 완료했습니다."
            ));
        }

        return ResponseEntity.ok(Map.of(
            "message", "출석체크 완료! 1포인트 지급"
        ));
    }
    @GetMapping("/attendance/today")
    public Map<String, Boolean> getTodayAttendance(@RequestParam String memberId) {
        boolean checked = missionService.isTodayAttendance(memberId);
        return Map.of("checked", checked);
    }
	
}
