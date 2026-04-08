package kr.co.iei.campaign.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.campaign.model.service.CampaignService;
import kr.co.iei.campaign.model.vo.Campaign;
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
	@GetMapping(value="{campaignNo}")
	public ResponseEntity<?> selectOneCampaign(@PathVariable Integer campaignNo){
		Campaign result = campaignService.selectOneCampaign(campaignNo);
		return ResponseEntity.ok(result);
	}
}
