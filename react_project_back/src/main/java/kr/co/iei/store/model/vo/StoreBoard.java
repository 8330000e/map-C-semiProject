package kr.co.iei.store.model.vo;

import lombok.Data;

import java.util.Date;

@Data
public class StoreBoard {

    private Long marketNo;
    private Long boardNo;
    private Long productPrice;
    private Integer readCount;
    private Integer isDeleted;
    private Integer tradeType;

    private String memberId;
    private String memberNickname;
    private String ctpvsggId;
    private String marketTitle;
    private String marketContent;
    private String productStatus;
    private String productThumb;

    private Date createdAt;
    private Date updatedAt;
}