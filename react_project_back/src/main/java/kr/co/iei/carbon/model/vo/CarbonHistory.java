package kr.co.iei.carbon.model.vo;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "carbonHistory")
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CarbonHistory {
    // period는 '2024-01'처럼 연도-월 형식 문자열임.
    // 프론트엔드에서는 이 값을 파싱해서 '1월', '2월' 등으로 보여줌.
    private String period;

    // emission은 해당 월의 탄소 배출량 값임.
    // 차트의 y축에 표시하는 실제 수치 데이터임.
    private Double emission;
}
