package kr.co.iei.utils;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Component
public class FileUtils {

    // application-secret.properties 에서 주입받음 (커밋되지 않는 파일)
    @Value("${aws.s3.access-key}")
    private String accessKey;

    @Value("${aws.s3.secret-key}")
    private String secretKey;

    @Value("${aws.s3.region}")
    private String region;

    @Value("${aws.s3.bucket}")
    private String bucket;

    // CloudFront 배포 도메인 (이미지 전용으로 새로 만든 배포)
    @Value("${aws.cloudfront.domain}")
    private String cloudfrontDomain;

    /**
     * 이미지를 S3에 업로드하고, CloudFront를 통해 접근 가능한 전체 URL을 반환함.
     *
     * @param savepath DB 저장용 폴더 구분 (예: "board/editor", "member" 등)
     * @param file     업로드할 파일
     * @return         CloudFront 기반 전체 이미지 URL (예: https://dxxxx.cloudfront.net/board/editor/uuid.png)
     */
    public String upload(String savepath, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // 폴더 구분자 정리 (앞뒤 슬래시 통일)
        String folder = savepath.endsWith("/") ? savepath : savepath + "/";

        // UUID 기반 파일명 생성 (중복 방지, 한글 파일명 인코딩 문제 회피)
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null) {
            int dotIndex = originalName.lastIndexOf('.');
            if (dotIndex >= 0) {
                extension = originalName.substring(dotIndex);
            }
        }
        String filename = UUID.randomUUID().toString() + extension;

        // S3에 저장될 객체 키 (버킷 내부 경로)
        String objectKey = folder + filename;

        S3Client s3 = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .build();

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(objectKey)
                    .contentType(file.getContentType())
                    // CloudFront/브라우저 캐싱: 파일명이 UUID라 같은 이름이 재사용될 일이 없으므로 길게 캐싱
                    .cacheControl("public, max-age=31536000, immutable")
                    .build();

            s3.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        } finally {
            s3.close();
        }

        // DB에는 CloudFront 전체 URL을 그대로 저장함 (프론트에서 추가 가공 없이 바로 img src로 사용 가능)
        return "https://" + cloudfrontDomain + "/" + objectKey;
    }
}
