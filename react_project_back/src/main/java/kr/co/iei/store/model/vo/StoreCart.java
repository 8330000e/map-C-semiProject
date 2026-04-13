package kr.co.iei.store.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;
import lombok.Data;

@Alias("storeCart")
@Data
public class StoreCart {

    private Long cartNo;
    private String memberId;
    private Long marketNo;
    private Integer quantity;
    private Date addedAt;

    private String marketTitle;
    private String productThumb;
    private Integer productPrice;
}
