package kr.co.iei.store.model.vo;

import java.util.Date;

import lombok.Data;

@Data
public class StoreBoard {

    private Long marketNo;
    private Integer boardNo;

    private String memberId;
    private String ctpvsggId;

    private String marketTitle;
    private String marketContent;

    private Integer productStatus;
    private Long productPrice;

    private String productThumb;

    private Date createdAt;
    private Date updatedAt;
}