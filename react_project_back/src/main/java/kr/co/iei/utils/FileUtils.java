package kr.co.iei.utils;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileUtils {

    public static String upload(String savepath, MultipartFile file) {
        // savepath가 유효하지 않으면 기본 사용자 홈 upload 폴더로 저장합니다.
        if (savepath == null || savepath.trim().isEmpty()) {
            savepath = System.getProperty("user.home") + File.separator + "upload" + File.separator;
        }

        File dir = new File(savepath);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // 원본 파일명에서 확장자만 추출합니다.
        // 실제 저장 시에는 한글명 대신 UUID 기반 이름을 사용하여 URL 안정성을 높입니다.
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null) {
            int dotIndex = originalName.lastIndexOf('.');
            if (dotIndex >= 0) {
                extension = originalName.substring(dotIndex);
            }
        }

        // UUID 기반 파일명 생성: 충돌 방지 및 파일명 인코딩 문제 회피
        String filename = UUID.randomUUID().toString() + extension;
        File savefile = new File(dir, filename);

        try {
            file.transferTo(savefile);
        } catch (IllegalStateException | IOException e) {
            e.printStackTrace();
        }

        // 실제 디스크에 저장된 파일명을 반환합니다.
        return filename;
    }
}