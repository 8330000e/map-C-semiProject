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
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<Map<String, Object>> checkAttendance(@RequestBody Map<String, String> param) {
        String memberId = param.get("memberId");

        Map<String, Object> result = missionService.checkAttendance(memberId);

        if ((int) result.get("result") == -1) {
            return ResponseEntity.badRequest().body(result);
        }

        return ResponseEntity.ok(result);
    }
    @GetMapping("/attendance/today")
    public Map<String, Boolean> getTodayAttendance(@RequestParam String memberId) {
        boolean checked = missionService.isTodayAttendance(memberId);
        return Map.of("checked", checked);
    }
    @GetMapping("/basic/today")
    public Map<String, Boolean> getTodayBasicMission(@RequestParam String memberId) {
        boolean completed = missionService.isTodayBasicMission(memberId);
        return Map.of("completed", completed);
    }
    
    @PostMapping("/basic/complete")
    public ResponseEntity<Map<String, String>> completeBasicMission(
            @RequestBody Map<String, String> param
    ) {
        String memberId = param.get("memberId");

        int result = missionService.completeBasicMission(memberId);

        if (result == -1) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "오늘 기본 미션은 이미 완료했습니다."
            ));
        }

        return ResponseEntity.ok(Map.of(
            "message", "기본 미션 완료! 10포인트 지급"
        ));
    }
    
    @GetMapping("/random/today/completed")
    public Map<String, Object> getTodayRandomMissionCompleted(
            @RequestParam String memberId,
            @RequestParam int missionNo
    ) {
        return missionService.getTodayRandomMissionStatus(memberId, missionNo);
    }
    
    
    @PostMapping("/random/certify")
    public ResponseEntity<Map<String, Object>> certifyRandomMission(
            @RequestParam("memberId") String memberId,
            @RequestParam("missionNo") int missionNo,
            @RequestParam("certImage") MultipartFile certImage
    ) {
        Map<String, Object> result = missionService.certifyRandomMission(memberId, missionNo, certImage);

        if ((int) result.get("result") == -1) {
            return ResponseEntity.badRequest().body(result);
        }

        return ResponseEntity.ok(result);
    }
    @GetMapping("/bonus/today")
    public Map<String, Boolean> getTodayBonusMission(@RequestParam String memberId) {
        boolean completed = missionService.isTodayBonusMission(memberId);
        return Map.of("completed", completed);
    }

    @PostMapping("/bonus/claim")
    public ResponseEntity<Map<String, String>> claimBonusMission(
            @RequestBody Map<String, Object> param
    ) {
        String memberId = (String)param.get("memberId");
        int missionNo = Integer.parseInt(param.get("missionNo").toString());

        int result = missionService.claimBonusMission(memberId, missionNo);

        if (result == -1) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "기본 미션과 랜덤 미션을 모두 완료해야 합니다."
            ));
        } else if (result == -2) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "오늘 보너스 미션은 이미 수령했습니다."
            ));
        } else if (result == -3) {
            return ResponseEntity.badRequest().body(Map.of(
                "message", "보너스 미션 정보가 올바르지 않습니다."
            ));
        }

        return ResponseEntity.ok(Map.of(
            "message", "보너스 미션 완료! 포인트 지급"
        ));
    }
}
