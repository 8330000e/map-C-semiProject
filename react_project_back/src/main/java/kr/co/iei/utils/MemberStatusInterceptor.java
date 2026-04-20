package kr.co.iei.utils;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.iei.member.model.dao.MemberDao;
import kr.co.iei.member.model.vo.LoginMember;

@Component
public class MemberStatusInterceptor implements HandlerInterceptor {
	
	@Autowired
	private JwtUtils jwtUtils;
	
	@Autowired
	private MemberDao memberDao;
	
	@Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws 
Exception {                                                                                                                   
	      
		// 헤더로 들어오는 토큰 꺼내기 
        String token = request.getHeader("Authorization");                                                            
                                                                                                                    
        // 토큰이 있고, "Bearer "로 시작하는 경우에만 진행   
       
        if (token != null && token.startsWith("Bearer ")) {                                                         
            // "Bearer " 잘라내고 토큰만 추출                                                   
            token = token.substring(7);                                                                               
                                                                                                                      
            // 토큰 검증                                           
            LoginMember loginMember = jwtUtils.checkToken(token);                                                   
                                                                                                                      
            // 토큰이 유효해서 loginMember가 null이 아닌 경우                                                      
            if (loginMember != null) {
                // loginMember에서 memberId 꺼내기                                                                    
                String memberId = loginMember.getMemberId();   
 
                // DB에서 해당 유저의 lock_until, lock_reason, member_status 조회                                            
                Map<String, Object> map = memberDao.getLockInfo(memberId);  
                
                                                                                                                      
                // 조회 결과가 있으면 (memberId가 존재하지 않으면 map이 null로 리턴됨)                                                          
                if (map != null) {
                    // member_status 값을 꺼냄 (0=정상, 1=영구정지, 3=기간정지)                                    
                    Integer status = ((Number) map.get("memberStatus")).intValue();                                   
                   System.out.println("status: " + status);
                    // 1 또는 3이면 차단 (정지상태)                                                
                    if (status == 1 || status == 3) {                                                               
                        // HTTP 상태코드 403 설정                                                      
                        response.setStatus(403);                                                                      
                        // 응답 타입을 JSON, 한글 깨짐 방지용 UTF-8 설정
                        response.setContentType("application/json;charset=UTF-8");                                    
                        // 프론트에서 구분할 수 있도록 "locked": true 응답                                           
                        response.getWriter().write("{\"locked\": true}");                                       
                        
                        // return false -> 해당 요청은 컨트롤러로 못넘어감 -> 요청했던 프론트로 돌아가야함 
                        // 원래라면 요청한 프론트 then, catch로 돌아감 > 프론트에도 인터셉터 넣어둠
                        // 요청한 쪽 말고 app.jsx의 인터셉터가 가로챔
                        return false;                                                                                 
                    }                                                                                               
                }                                                                                                     
            }                                                                                                       
        }
        // 정상 회원이거나 토큰이 없는 요청 -> 원래 요청 보냈던 컨트롤러로 그대로 진행                                              
        return true;                                                                                                  
    }                                       
}
