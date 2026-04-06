package kr.co.iei.region.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.member.model.service.MemberService;
import kr.co.iei.region.model.service.RegionService;
import kr.co.iei.region.model.vo.Region;

@CrossOrigin(value = "*")
@RestController
@RequestMapping(value = "/regions")
public class RegionController {

    @Autowired
    private RegionService regionService;
    
    @Autowired
    private MemberService memberService;

    @GetMapping
    public List<Region> selectRegionList() {
        return regionService.selectRegionList();
    }
    
    @PostMapping("/contribute")
    public ResponseEntity<?> contributePoint(@RequestBody Map<String, Object> param) {
        String memberId = (String) param.get("memberId");
        int regionNo = Integer.parseInt(param.get("regionNo").toString());
        int point = Integer.parseInt(param.get("point").toString());

        int result = regionService.contributePoint(memberId, regionNo, point);

        Map<String, Object> response = new HashMap<>();
        response.put("result", result);
        response.put("message", result > 0 ? "물 주기 성공" : "물 주기 실패");

        return ResponseEntity.ok(response);
    }
}