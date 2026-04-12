package kr.co.iei.utils;

import org.springframework.web.client.RestTemplate;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class LocationParser {

    public static String getLocation(String ip) {
        RestTemplate restTemplate = new RestTemplate();
        
        // 로컬이면 공인 IP 가져오기
        if (ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1")) {
            ip = restTemplate.getForObject("https://api.ipify.org", String.class);
        }
        
        // 1. IP로 위치 조회
        String response = restTemplate.getForObject("http://ip-api.com/json/" + ip, String.class);
        
        System.out.println("location: " + response);
        
        // 2. JSON에서 도시, 국가 뽑기
        JsonObject json = JsonParser.parseString(response).getAsJsonObject();
        String region = json.get("regionName").getAsString();
        String country = json.get("country").getAsString();

        return region + ", " + country;
    }
}