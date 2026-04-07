package kr.co.iei.store.model.vo;

import java.util.Date;

import lombok.Data;

@Data
public class StoreBoard {

    private Long marketNo;
    private Integer boardNo;

    private String memberId;
    private String memberNickname;
    private String ctpvsggId;
    private String marketTitle;
    private String marketContent;
    private Integer productPrice;
    private String productStatus; // 0, 1, 2로 저장, 반환 시 한글 변환
    private String productThumb;
    private String tradeType;
    private Integer readCount;
    private String regionName;

    private Date createdAt;
    private Date updatedAt;

    // Lombok should generate this, but add explicitly for build stability
    public String getProductStatus() {
        return productStatus;
    }

    public void setProductStatus(String productStatus) {
        this.productStatus = productStatus;
    }

}