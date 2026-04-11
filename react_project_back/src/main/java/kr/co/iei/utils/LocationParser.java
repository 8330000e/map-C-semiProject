package kr.co.iei.utils;

import org.springframework.web.client.RestTemplate;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class LocationParser {

    public static String getLocation() {
        RestTemplate restTemplate = new RestTemplate();
        
        // 1. 공인 IP 가져오기
        String publicIp = restTemplate.getForObject("https://api.ipify.org", String.class);
        
        // 2. IP로 위치 조회
        String response = restTemplate.getForObject("http://ip-api.com/json/" + publicIp, String.class);
        
        // 3. JSON에서 도시, 국가 뽑기
        JsonObject json = JsonParser.parseString(response).getAsJsonObject();
        String region = json.get("regionName").getAsString();
        String country = json.get("country").getAsString();

        return region + ", " + country;
    }
}