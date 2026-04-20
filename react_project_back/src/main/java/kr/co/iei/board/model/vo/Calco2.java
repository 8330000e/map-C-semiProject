package kr.co.iei.board.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="calco2")
public class Calco2 {
    private Integer CNo;
    private Integer boardNo;
    private String memberId;
    private String ctpvsggId;
    private Integer cEleA;
    private Integer cEle;
    private Integer cGasA;
    private Integer cGas;
    private Integer cWaterA;
    private Integer cWater;
    private Integer cRoad;
    private Integer cWasteA;
    private Integer cWaste;
    private Integer cTotal;

    private String ctpv;
    private String sgg;
}
