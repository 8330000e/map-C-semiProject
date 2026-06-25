package kr.co.iei;

import kr.co.iei.utils.AdminInterceptor;
import kr.co.iei.utils.MemberStatusInterceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// WebConfig는 CORS 정책, API prefix, 인터셉터만 처리함.
// 이미지는 더 이상 백엔드(로컬 디스크)에서 서빙하지 않고, S3 + CloudFront에서 직접 서빙함.
@Configuration
public class WebConfig implements WebMvcConfigurer {
	@Autowired
	private MemberStatusInterceptor memberStatusInterceptor;
	@Autowired AdminInterceptor adminInterceptor;
    
    
    
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		// allowCredentials(true)를 사용할 때는 allowedOrigins("*")를 사용할 수 없습니다.
		// 브라우저는 자격 증명 포함 응답에서 Access-Control-Allow-Origin을 '*'로 설정하는 것을 허용하지 않습니다.
		// 따라서 명시적 origin 목록이나 allowedOriginPatterns를 사용해야 합니다.
		registry.addMapping("**")
			.allowedOrigins("https://d2g15isq25ks7i.cloudfront.net/")
			.allowedOriginPatterns("https://d2g15isq25ks7i.cloudfront.net","http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:9999")
			.allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
			.allowedHeaders("*")
			.allowCredentials(true);
	}

	@Override
        public void configurePathMatch(PathMatchConfigurer configurer) {
            // 모든 컨트롤러의 매핑 앞에 자동으로 /api를 붙입니다.
            configurer.addPathPrefix("/api", c -> true);
        }
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(memberStatusInterceptor)
				.addPathPatterns("/api/**")
				.excludePathPatterns("/members/login",
                    "/members/login",
                    "/members/email-verification",
                    "/members/signup",
                    "/members/check-id",
                    "/admins/**",
                    "/boards/**",
                    "/campaigns/**",
                    "/carbon/**",
                    "/alarms/**",
                    "/donations/**",
                    "/members/**",
                    "/missions/**",
                    "/regions/codes/**",
                    "/regions/**",
                    "/store/**",
                    "/supports/**");
		
		registry.addInterceptor(adminInterceptor)
				.addPathPatterns("/admins/**");
	}
}