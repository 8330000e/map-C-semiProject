package kr.co.iei.store.model.vo;

import java.util.Date;

import lombok.Data;

@Data
public class StoreRating {

    private Long reviewNo;
    private Long tradeNo;
    private Long marketNo;
    private String sellerId;
    private String buyerId;
    private String buyerNickname;
    private Integer rating;
    private String reviewContent;
    private String reviewThumb;
    private Date createdAt;
    private Integer isDeleted;
    private Integer isPrivate;
}
