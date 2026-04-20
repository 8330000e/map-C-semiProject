package kr.co.iei;

import kr.co.iei.utils.MemberStatusInterceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// WebConfig는 CORS 정책만 처리함.
// 로컬 정적 이미지 경로(/board/editor, /member/thumb)는 더 이상 백엔드에서 서빙하지 않음.
// 지금은 Firebase 업로드된 이미지 URL만 사용하도록 처리했음.
@Configuration
public class WebConfig implements WebMvcConfigurer {
	@Autowired
	private MemberStatusInterceptor memberStatusInterceptor;
    
    
    
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
     public void addInterceptors(InterceptorRegistry registry) {                                                     
         registry.addInterceptor(memberStatusInterceptor) // memberStatusInterceptor 등록
                 .addPathPatterns("/**")           // 모든 요청에 적용
                 .excludePathPatterns("/members/login", "/admins/**"); // 로그인만 제외 (로그인 로직에 따로 추가해뒀음) + 관리자도 제외     
         
         registry.addInterceptor(adminInterceptor) // adminInterceptor 등록
         		 .addPathPatterns("/admins/**"); // 모든 /admin/* 요청에 적용  
     }
}
