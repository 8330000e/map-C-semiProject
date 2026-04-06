package kr.co.iei;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig implements WebMvcConfigurer{//MVC 관련 설정
	@Value("${file.root}")
	private String root;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
			.allowedOriginPatterns("http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:9999")
			.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
			.allowedHeaders("*")
			.allowCredentials(true);
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {//정적 파일 URL과 실제 서버 폴더를 연결하는 매니저(.......)
	
		
		registry
		.addResourceHandler("/member/thumb/**")		//요청패턴 
		.addResourceLocations("file:///"+root+"member/");	//실제경로(파일과 직접 연결)
        // 에디터 이미지
        registry.addResourceHandler("/board/editor/**")
                .addResourceLocations("file:///C:/Temp/upload/board/editor/");
	}

}