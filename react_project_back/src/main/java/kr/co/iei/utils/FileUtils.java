package kr.co.iei.utils;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileUtils {

    public static String upload(String savepath, MultipartFile file) {
        if (savepath == null || savepath.trim().isEmpty()) {
            savepath = System.getProperty("user.home") + File.separator + "upload" + File.separator;
        }

        File dir = new File(savepath);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        File savefile = new File(dir, filename);

        try {
            file.transferTo(savefile);
        } catch (IllegalStateException | IOException e) {
            e.printStackTrace();
        }

        return filename;
    }
}