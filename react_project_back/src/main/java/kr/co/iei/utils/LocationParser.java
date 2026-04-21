package kr.co.iei.utils;

import org.springframework.web.client.RestTemplate;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class LocationParser {

    public static String getLocation(String ip) {
        RestTemplate restTemplate = new RestTemplate();
        
        try {
            // 로컬(Loopback)이거나 사설 IP인 경우 공인 IP로 대체 시도
            if (ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1") || ip.startsWith("192.168.")) {
                ip = restTemplate.getForObject("https://api.ipify.org", String.class);
            }
            
            // 1. IP로 위치 조회
            String response = restTemplate.getForObject("http://ip-api.com/json/" + ip, String.class);
            System.out.println("location: " + response);
            
            // 2. JSON 파싱
            JsonObject json = JsonParser.parseString(response).getAsJsonObject();
            
            // "status"가 "fail"인 경우 예외 처리
            if (json.has("status") && "fail".equals(json.get("status").getAsString())) {
                return "Unknown Location (Private IP)";
            }

            // 필드 존재 여부 확인 후 안전하게 추출 (NullPointerException 방지)
            String region = getJsonString(json, "regionName", "Unknown Region");
            String country = getJsonString(json, "country", "Unknown Country");

            return region + ", " + country;
            
        } catch (Exception e) {
            e.printStackTrace();
            return "Location Error";
        }
    }

    // JSON 필드를 안전하게 가져오기 위한 헬퍼 메소드
    private static String getJsonString(JsonObject json, String key, String defaultValue) {
        JsonElement element = json.get(key);
        return (element != null && !element.isJsonNull()) ? element.getAsString() : defaultValue;
    }
}
