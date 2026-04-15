package kr.co.iei.store.model.vo;

import java.util.Date;

import lombok.Data;

@Data
public class StoreTradeInfo {

    private Long tradeNo;
    private Long marketNo;
    private String sellerId;
    private String sellerNickname;
    private String buyerId;
    private String buyerNickname;
    private String ctpvsggId;
    private Long tradePrice;
    private Integer tradeStatus;
    private String tradeType;
    private Date createdAt;
    private Date completedAt;
    private String reviewYn;
    private String cancleReason;
    private String receiverName;
    private String buyerName;
    private String buyerPhone;
    private String zipCode;
    private String address;
    private String addressDetail;
    private String deliveryMemo;
    private String invoiceNumber;
    private Integer courierCode;
    private Integer shippingStatus;
}
