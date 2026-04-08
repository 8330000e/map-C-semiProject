package kr.co.iei;

import java.io.File;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig implements WebMvcConfigurer {//MVC 관련 설정
	// application.properties에 설정된 file.root 값을 사용하여 정적 리소스의 실제 파일 시스템 위치를 결정합니다.
	// Windows와 macOS 모두에서 동작하도록 File.toURI()를 사용합니다.
	@Value("${file.root}")
	private String root;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		// allowCredentials(true)를 사용할 때는 allowedOrigins("*")를 사용할 수 없습니다.
		// 브라우저는 자격 증명 포함 응답에서 Access-Control-Allow-Origin을 '*'로 설정하는 것을 허용하지 않습니다.
		// 따라서 명시적 origin 목록이나 allowedOriginPatterns를 사용해야 합니다.
		registry.addMapping("/**")
			.allowedOriginPatterns("http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:9999")
			.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
			.allowedHeaders("*")
			.allowCredentials(true);
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// 정적 파일 매핑을 운영체제 경로에 맞게 생성합니다.
		registry
			.addResourceHandler("/member/thumb/**")
			.addResourceLocations(getFileUri(new File(root, "member")));

		// 에디터 이미지 매핑도 동일한 파일 루트를 사용합니다.
		registry.addResourceHandler("/board/editor/**")
			.addResourceLocations(getFileUri(new File(root, "board/editor")));

		// 사용자 홈 디렉터리 upload 폴더를 /upload/**로 매핑합니다.
		String uploadPath = System.getProperty("user.home") + File.separator + "upload" + File.separator;
		registry.addResourceHandler("/upload/**")
			.addResourceLocations(new File(uploadPath).toURI().toString());
	}

	/**
	 * 윈도우와 맥(macOS) 모두에서 정상 동작하도록 파일 시스템 경로를 URI로 변환합니다.
	 */
	private String getFileUri(File file) {
		return file.toURI().toString();
	}

}