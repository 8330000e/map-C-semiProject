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

    private String productThumb;

    private Date createdAt;
    private Date updatedAt;
}