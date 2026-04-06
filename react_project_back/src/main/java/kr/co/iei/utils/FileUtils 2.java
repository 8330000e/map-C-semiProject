package kr.co.iei.utils;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
@Component
public class FileUtils {
	public String upload(String savepath, MultipartFile file) {
		//사용자가 올린 원본파일 이름
		String filename = file.getOriginalFilename();
		int dotIndex = filename.lastIndexOf(".");//.이 가장 마지막에 찍혀 있는 부분(heheheuser.jpg -> jpg부분)
		String extension ="";
		if(dotIndex != -1) {//-1이면 파일이름이 없음
			extension = filename.substring(dotIndex);//jpg와같은 확장자!? 부분 위에서 구분해 놓은 것 저장			
		}
		String uuid= UUID.randomUUID().toString(); //랜덤 파일 이름을 생성
		String filepath = uuid + extension;//랜덤 생성 이름 + jpg같은것
		
		File savefile = new File(savepath + filepath);
		
		try {
			file.transferTo(savefile);
		} catch (IllegalStateException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return filepath;
	}

}
