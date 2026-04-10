package kr.co.iei.campaign.controller;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.campaign.model.service.CampaignService;
import kr.co.iei.campaign.model.vo.Campaign;
import kr.co.iei.campaign.model.vo.CampaignParticipance;
import kr.co.iei.utils.FileUtils;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping(value="/campaigns")
public class CampaignController {
	@Autowired
	private CampaignService campaignService;
	@Autowired
	private FileUtils fileUtil;

	@Value("${file.root}")
	private String root;
	
	
	
	@GetMapping
	public ResponseEntity<?> selectAllCampaign(@RequestParam(defaultValue="") String campaignTitle){
		List<Campaign> list = campaignService.selectAllCampaign(campaignTitle);
		return ResponseEntity.ok(list);
	}
	@GetMapping(value="/{campaignNo}")
	public ResponseEntity<?> selectOneCampaign(@PathVariable Integer campaignNo){
		Campaign result = campaignService.selectOneCampaign(campaignNo);
//		System.out.println(result);
		return ResponseEntity.ok(result);
	}
	@PostMapping(value="/{memberId}")
	public ResponseEntity<?> createCampaign(@PathVariable String memberId,@RequestBody Campaign camp){
		camp.setMemberId(memberId);
		int result = campaignService.createCampaign(camp);
		return ResponseEntity.ok(result);
	}
	@GetMapping(value="/{memberId}/part")
	public ResponseEntity<?> checkParticipanceMember(@PathVariable String memberId,@RequestParam Integer campaignNo){
		Campaign c = new Campaign();
		c.setMemberId(memberId);
		c.setCampaignNo(campaignNo);
		int result = campaignService.checkParticipanceMember(c);
		return ResponseEntity.ok(result);
	}
	@PostMapping(value="/{campaignNo}/join")
	public ResponseEntity<?> joinCampaign(@PathVariable Integer campaignNo, @RequestBody Map<String,String> map){
		String memberId=map.get("memberId");
		Campaign camp = new Campaign();
		camp.setMemberId(memberId);
		camp.setCampaignNo(campaignNo);
		int result = campaignService.joinCampaign(camp);
		return ResponseEntity.ok(result);
	}
	@PostMapping(value="/{memberId}/memothumb")
	public ResponseEntity<?> insertMemo(@PathVariable String memberId,@RequestParam("campaignThumb") MultipartFile memoThumb,
			@RequestParam("campaignMemo") String campaignMemo, @RequestParam("campaignNo") Integer campaignNo){
		if(memoThumb == null|| memoThumb.isEmpty()) {
			throw new RuntimeException("썸네일이 없음");
		}
		File saveFolder = new File(new File(root),"campaign/memo");
		if(!saveFolder.exists()) {
			saveFolder.mkdirs();
		}
		CampaignParticipance campPart = new CampaignParticipance();
		String filename = FileUtils.upload(saveFolder.getAbsolutePath() + File.separator,memoThumb);
		campPart.setCampaignThumb(filename);
		System.out.println(filename);
		campPart.setMemberId(memberId);
		campPart.setCampaignNo(campaignNo);
		campPart.setCampaignMemo(campaignMemo);
		int result = campaignService.insertMemo(campPart);
		return ResponseEntity.ok(result);
	}
	@GetMapping(value="/boards")
	public ResponseEntity<?> getCampBoardList(@RequestParam Integer campaignNo){
		List<CampaignParticipance> campPart = campaignService.getCampBoardList(campaignNo);
		return ResponseEntity.ok(campPart);
	}
	
	
}
