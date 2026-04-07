package kr.co.iei.store.model.vo;

import java.util.Date;

public class StoreTradeInfo {

    private Long tradeNo;
    private Long marketNo;
    private String sellerId;
    private String buyerId;
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

    public Long getTradeNo() {
        return tradeNo;
    }

    public void setTradeNo(Long tradeNo) {
        this.tradeNo = tradeNo;
    }

    public Long getMarketNo() {
        return marketNo;
    }

    public void setMarketNo(Long marketNo) {
        this.marketNo = marketNo;
    }

    public String getSellerId() {
        return sellerId;
    }

    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    public String getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(String buyerId) {
        this.buyerId = buyerId;
    }

    public String getCtpvsggId() {
        return ctpvsggId;
    }

    public void setCtpvsggId(String ctpvsggId) {
        this.ctpvsggId = ctpvsggId;
    }

    public Long getTradePrice() {
        return tradePrice;
    }

    public void setTradePrice(Long tradePrice) {
        this.tradePrice = tradePrice;
    }

    public Integer getTradeStatus() {
        return tradeStatus;
    }

    public void setTradeStatus(Integer tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    public String getTradeType() {
        return tradeType;
    }

    public void setTradeType(String tradeType) {
        this.tradeType = tradeType;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Date completedAt) {
        this.completedAt = completedAt;
    }

    public String getReviewYn() {
        return reviewYn;
    }

    public void setReviewYn(String reviewYn) {
        this.reviewYn = reviewYn;
    }

    public String getCancleReason() {
        return cancleReason;
    }

    public void setCancleReason(String cancleReason) {
        this.cancleReason = cancleReason;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public void setBuyerName(String buyerName) {
        this.buyerName = buyerName;
    }

    public String getBuyerPhone() {
        return buyerPhone;
    }

    public void setBuyerPhone(String buyerPhone) {
        this.buyerPhone = buyerPhone;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAddressDetail() {
        return addressDetail;
    }

    public void setAddressDetail(String addressDetail) {
        this.addressDetail = addressDetail;
    }

    public String getDeliveryMemo() {
        return deliveryMemo;
    }

    public void setDeliveryMemo(String deliveryMemo) {
        this.deliveryMemo = deliveryMemo;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public Integer getCourierCode() {
        return courierCode;
    }

    public void setCourierCode(Integer courierCode) {
        this.courierCode = courierCode;
    }

    public Integer getShippingStatus() {
        return shippingStatus;
    }

    public void setShippingStatus(Integer shippingStatus) {
        this.shippingStatus = shippingStatus;
    }
}
