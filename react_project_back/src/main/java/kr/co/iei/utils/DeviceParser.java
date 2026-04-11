package kr.co.iei.utils;

public class DeviceParser {

	public static String parse(String userAgent) {
		
		// os 구분 
		String os = "Unknown";
		if (userAgent.contains("Windows")) os = "Windows";
		else if (userAgent.contains("Mac")) os = "Mac";
		else if (userAgent.contains("Android")) os = "Android";
		else if (userAgent.contains("iPhone")) os = "iPhone";
		
		// 브라우저 구분 
		String browser = "Unknown";
		if (userAgent.contains("Edg")) browser = "Edg";
		else if (userAgent.contains("Chrome")) browser = "Chrome";
		else if (userAgent.contains("Safari")) browser = "Safari";
		else if (userAgent.contains("Firefox")) browser = "Firefox";
		
		
		return os + "(" + browser + ")"; 
	}
}
