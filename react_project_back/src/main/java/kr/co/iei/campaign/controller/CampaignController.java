package kr.co.iei.campaign.controller;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.google.api.services.storage.Storage;
import com.google.api.services.storage.model.Bucket;
import com.google.cloud.firestore.Blob;
import com.google.firebase.cloud.StorageClient;

import kr.co.iei.campaign.model.service.CampaignService;
import kr.co.iei.campaign.model.vo.Campaign;
import kr.co.iei.campaign.model.vo.CampaignNotice;
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
		System.out.println(result);
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
//		File saveFolder = new File(new File(root),"campaign/memo");
//		if(!saveFolder.exists()) {
//			saveFolder.mkdirs();
//		}
		CampaignParticipance campPart = new CampaignParticipance();
		String fileUrl = FileUtils.upload("/campaign/memo/",memoThumb);
		campPart.setCampaignThumb(fileUrl);
		System.out.println(fileUrl);
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
	@GetMapping(value="/board/{campaignParticipanceNo}")
	public ResponseEntity<?> getCampBoardDetail(@PathVariable Integer campaignParticipanceNo){
		CampaignParticipance campPart = campaignService.getCampBoardDetail(campaignParticipanceNo);
		return ResponseEntity.ok(campPart);
	}
	@PatchMapping(value="/{campaignParticipanceNo}")
	public ResponseEntity<?> updateParticipanceBoard(@PathVariable Integer campaignParticipanceNo,@RequestParam String campaignMemo,
			@RequestParam("file") MultipartFile file,@RequestParam String deletePath){
//		if(file == null || file.isEmpty()) {
//			throw new RuntimeException("보내진 파일 X");
//		}
		if(file != null || !file.isEmpty()) {
//			File saveFolder = new File(new File(root),"campaign/memo");
			CampaignParticipance campPart = new CampaignParticipance();
			String fileUrl = FileUtils.upload("/campaign/memo/",file);
			campPart.setCampaignThumb(fileUrl);
			campPart.setCampaignMemo(campaignMemo);
			campPart.setCampaignParticipanceNo(campaignParticipanceNo);
			int result = campaignService.updateParticipanceBoard(campPart);
			if(result>0) {
//				File terminatePath = new File(new File(root),"campaign/memo/"+deletePath);
//				if(terminatePath.exists()) {
//					terminatePath.delete();
//				}
				//사실 시간이 없어서 gpt 의 힘을 빌렸으나, 최대한 fireStorage에 대해 공부 해서 bucket/blob/storageclient 구조에 대해 알아볼것임
				// 1. URL decode ( %2F → / )
				String decoded;
				try {
					decoded = URLDecoder.decode(deletePath, "UTF-8");
					
					// 2. "/o/" 뒤 부분 가져오기
					String path = decoded.split("/o/")[1];
					
					// 3. 쿼리스트링 제거 (?alt=media 제거)
					path = path.split("\\?")[0];
					com.google.cloud.storage.Bucket bucket = StorageClient.getInstance().bucket();
					com.google.cloud.storage.Blob blob = bucket.get(path);
					if(blob!= null) {
						blob.delete();
					}
					
					
				} catch (UnsupportedEncodingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

				
				
			}
			return ResponseEntity.ok(result);
		}
		return ResponseEntity.ok(0);
	}
	@DeleteMapping(value="/{campaignParticipanceNo}/board")
	public ResponseEntity<?> deleteBoardMemo(@PathVariable int campaignParticipanceNo){
		String deletePath = campaignService.deleteBoardMemo(campaignParticipanceNo);
		int result=0;
		if(deletePath.equals("f") || deletePath == null || deletePath.isEmpty()) {
			return ResponseEntity.ok(result);
		}else {
			String decode;
			try {
				decode = URLDecoder.decode(deletePath,"UTF-8");
				String decoding = decode.split("/o/")[1];
				decoding = decoding.split("\\?")[0];
				com.google.cloud.storage.Bucket bucket = StorageClient.getInstance().bucket();
				com.google.cloud.storage.Blob blob = bucket.get(decoding);
				if(blob != null) {
					blob.delete();
					result =1;
				}
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return ResponseEntity.ok(result);
		}
	}
	@PostMapping(value="/insertNotice")
	public ResponseEntity<?> insertCampNotice(@RequestBody CampaignNotice campNotice){
		int result = campaignService.insertCampNotice(campNotice);
		return ResponseEntity.ok(result);
	}
	@PatchMapping(value="/{campaignNo}/inherit")
	public ResponseEntity<?> inheritManager(@PathVariable Integer campaignNo){
		int result = campaignService.inheritManager(campaignNo);
		return ResponseEntity.ok(result);
	}
	@PostMapping(value="/ban")
	public ResponseEntity<?> banPartMember(@RequestBody Campaign camp){
		int result = campaignService.banPartMember(camp);
		return ResponseEntity.ok(result);
	}
	@GetMapping(value="/{campaignNo}/noBanMember")
	public ResponseEntity<?> checkBannedMember(@PathVariable Integer campaignNo,@RequestParam String memberId){
		Campaign camp = new Campaign();
		camp.setMemberId(memberId);
		camp.setCampaignNo(campaignNo);
		int result = campaignService.checkBannedMember(camp);
		return ResponseEntity.ok(result);
	}
	@GetMapping(value="/{campaignNo}/forUpdate")
	public ResponseEntity<?> selectCampForUpdate(@PathVariable Integer campaignNo){
		Campaign camp = campaignService.selectCampForUpdate(campaignNo);
		return ResponseEntity.ok(camp);
	}
	@PatchMapping(value="/{campaignNo}/updateCamp")
	public ResponseEntity<?> updateCamp(@PathVariable Integer campaignNo,@RequestBody Campaign camp){
		camp.setCampaignNo(campaignNo);
		int result = campaignService.updateCamp(camp);
		return ResponseEntity.ok(result);
	}
	@GetMapping(value="/notice")
	public ResponseEntity<?> getNoticeList(){
		List<CampaignNotice> campNo = campaignService.getNoticeList();
		return ResponseEntity.ok(campNo);
	}
	@PatchMapping(value="/{campaignNo}/terminate")
	public ResponseEntity<?> terminateCamp(@PathVariable Integer campaignNo){
		int result = campaignService.terminateCamp(campaignNo);
		return ResponseEntity.ok(result);
	}
	
}













