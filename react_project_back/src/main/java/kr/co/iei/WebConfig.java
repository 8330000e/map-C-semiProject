package kr.co.iei;

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
		// 로컬 업로드 경로를 정적 리소스로 제공하지 않습니다.
		// 모든 업로드 이미지와 파일은 Firebase Storage에서 직접 제공되어야 합니다.
	}

}