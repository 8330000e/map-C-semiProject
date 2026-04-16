package kr.co.iei.utils;


import java.security.Key;

import java.util.Calendar;
import java.util.Date;

import javax.crypto.SecretKey;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import kr.co.iei.member.model.vo.LoginMember;


//@Component
//스프링이 이 클래스를 자동으로 관리하라.
//스프링 서버가 실행될 때
//JwtUtils 객체를 자동으로 생성해서 Bean으로 등록
//다른 클래스에서 @Autowired로 바로 사용 가능
//즉 "이건 유틸 클래스니까 내가 new 안 하고 스프링이 알아서 써줄게"

@Component
public class JwtUtils {

	@Value("${jwt.secret-key}")
	private String secretKey;
	@Value("${jwt.expire-hour}")
	private Integer expireHour;
	
	public LoginMember createToken(String memberId, Integer memberGrade, String memberNickname) {

		if (memberNickname == null) {
			memberNickname = "";
		}

		if (secretKey == null || secretKey.isBlank()) {
			throw new IllegalStateException("JWT secret key is not configured");
		}

		// 즉 이런 형태임 -> "hello" → [104, 101, 108, 108, 111]
		// keys.hmacShaKeyFor->
		// -> 전달받은 바이트를 HMAC-SHA 방식의 서명 키(SecretKey) 로 만들어줌
		// 토큰 위조 방지용 디지털 도장 -> 사인에 필수
		// -> 이 키 없으면 토큰 절대 못 만듦 (위조 불가)

		SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

		Calendar c = Calendar.getInstance();
		Date startTime = c.getTime();
		c.add(Calendar.MINUTE, expireHour);
		Date endTime = c.getTime();

		// issuedAt -> 버전을 잘맞춰야함. 그렇지 않으면 에러가남
		// 라이브러리 3개 세트 버전 통일 (api, impl, jackson)
		String token = Jwts.builder().issuedAt(startTime) // 토큰 발행시간
				.expiration(endTime) // 토큰 만료시간 -> 한시간동안 로그인상태 유지?
				.signWith(key) // 암호화 서명
				.claim("memberId", memberId) // 토큰에 포함될 부가정보
				.claim("memberGrade", memberGrade) // 토큰에 포함될 부가정보
				.claim("memberNickname", memberNickname) // 여기 추가
				.compact();

		LoginMember login = new LoginMember();
		login.setMemberGrade(memberGrade);
		login.setMemberId(memberId);
		login.setToken(token);
		login.setEndTime(endTime.getTime());
		login.setMemberNickname(memberNickname);
		return login; // 위의 과정을 잘 통합해서 토큰을 발행하라는 의미

	}
	
	// 위에서 설정한 토큰을 검증하기 위한 로직

		public LoginMember checkToken(String token) {
			// 토큰을 추출하고 로그인타입으로 반환하기 위한 과정
			// 토큰값이 맞는지 아닌지를 위한 검색과정

			try {

				SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
				Claims claims = (Claims) Jwts.parser().verifyWith(key).build().parse(token).getPayload();
				/*
				 * 이건 버전 13방식. -> 강사님이 짜준 코드에서 만약 에러가 나면 13방식으 대체 Claims claims =
				 * Jwts.parserBuilder() .setSigningKey(key) .build() .parseClaimsJws(token)
				 * .getBody();
				 * 
				 */

				String memberId = (String) claims.get("memberId");
				Integer memberGrade = (Integer) claims.get("memberGrade");
				String memberNickname = (String) claims.get("memberNickname");
				LoginMember login = new LoginMember();
				login.setMemberId(memberId);
				login.setMemberGrade(memberGrade);
				login.setMemberNickname(memberNickname);
				return login;
			} catch (io.jsonwebtoken.ExpiredJwtException e) {
				System.out.println("토큰 만료됨");
				return null;
			} catch (io.jsonwebtoken.JwtException e) {
				System.out.println("유효하지 않은 토큰");
				return null;
			}
		}


	

	
}
