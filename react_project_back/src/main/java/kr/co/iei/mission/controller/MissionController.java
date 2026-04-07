package kr.co.iei.mission.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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
	
}
