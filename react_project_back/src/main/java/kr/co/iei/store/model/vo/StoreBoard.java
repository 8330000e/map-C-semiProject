package kr.co.iei.store.model.vo;

import lombok.Data;
import java.util.Date;

@Data
public class StoreBoard {

    private Long marketNo;
    private Long boardNo;

    private String memberId;
    private String ctpvsggId;

    private String marketTitle;
    private String marketContent;

    private Integer productStatus;
    private Long productPrice;
    private String tradeType;

    private String productThumb;
    private String memberNickname;

    private Integer readCount;
    private Integer isDeleted;

    private Date createdAt;
    private Date updatedAt;

    // Explicit getters for IDE/compiler compatibility (in case Lombok isn't processed)
    public String getMemberId() {
        return this.memberId;
    }

    public String getMarketTitle() {
        return this.marketTitle;
    }

    public String getMarketContent() {
        return this.marketContent;
    }

    public String getProductThumb() {
        return this.productThumb;
    }
}