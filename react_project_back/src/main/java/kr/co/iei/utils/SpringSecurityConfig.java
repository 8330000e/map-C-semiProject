package kr.co.iei.utils;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity

public class SpringSecurityConfig {
	@Bean
	 public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
        //cors(cors ->{})=>OPTIONS 요청은 검사하지 말고 CORS로 처리해
        .cors(cors ->{})
        .csrf(csrf -> csrf.disable()) // 필요 시 비활성화
        .authorizeHttpRequests(auth -> auth
        		//"/members/login", "/members"-> 직접 회원가입, 로그인 요청의 post 경로를 설정
        		.requestMatchers("/members/login", "/members").permitAll() // permitAll-> 로그인 경로 허용(임시) // 수정 필요  
        		.requestMatchers("/members/**").permitAll()
        		
        		.requestMatchers("/boards/**").permitAll()//게시글
        		.requestMatchers("/board/editor/**").permitAll()//에디터 사진 저장 경로

        		//이 URL은 로그인 안 해도 들어와도 된다”
        		//현재 토큰이 없는 관계로 이 방식을 통해 리엑트와 연결 
                .anyRequest().authenticated() // 나머지는 인증 필요
        		//.anyRequest().permitAll() // 모든 요청 허용-> jwt를 만들면 해제
        )
        .formLogin(form -> form.disable()) // 로그인 폼 비활성화 (선택)
        .httpBasic(basic -> basic.disable()); // 기본 인증 비활성화 (선택)

        return http.build();
}
	@Bean
	public BCryptPasswordEncoder bcrypt() {
		return new BCryptPasswordEncoder();
	}
}
