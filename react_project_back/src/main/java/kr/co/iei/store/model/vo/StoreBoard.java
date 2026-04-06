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
    private String productStatus;
    private String productThumb;
    private String tradeType;
    private Integer readCount;
    private String regionName;

    private Date createdAt;
    private Date updatedAt;
}