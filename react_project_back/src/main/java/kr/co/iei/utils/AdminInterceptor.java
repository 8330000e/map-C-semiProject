package kr.co.iei.utils;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.iei.member.model.vo.LoginMember;

@Component
public class AdminInterceptor implements HandlerInterceptor {
	@Autowired
	private JwtUtils jwtUtils;
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws IOException {
		// 1. 프론트에서 보낸 토큰 가져오기 
		String token = request.getHeader("Authorization");
		
		// 2. 빈토큰인지 확인 and Bearer 로 시작하는지
		if (token != null && !token.equals("") && token.startsWith("Bearer ")) {
			
			// Bearer 만 짤라내기 공백까지 7 
			token = token.substring(7);
			try {
				// 3. JwtUtils의 checkToken으로 토큰 검증 (서명)
				LoginMember login = jwtUtils.checkToken(token);
				
				// 4. 등급이 1번(관리자)인지 확인
				if (login != null && login.getMemberGrade() == 1) {
					return true;
				}
			} catch(Exception e) {
				// 토큰 만료, 변조된 경우 에러
				System.out.println("토큰검증실패");
			}	
		}
		
		// 5. 토큰이 없거나 관리자가 아니면 403에러 반환
		response.setStatus(403); 
		response.getWriter().write("AdminOnly");
		return false;
	}
}