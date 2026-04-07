package kr.co.iei.store.model.vo;

import java.util.Date;

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

    public Long getReviewNo() { return reviewNo; }
    public void setReviewNo(Long reviewNo) { this.reviewNo = reviewNo; }

    public Long getTradeNo() { return tradeNo; }
    public void setTradeNo(Long tradeNo) { this.tradeNo = tradeNo; }

    public Long getMarketNo() { return marketNo; }
    public void setMarketNo(Long marketNo) { this.marketNo = marketNo; }

    public String getSellerId() { return sellerId; }
    public void setSellerId(String sellerId) { this.sellerId = sellerId; }

    public String getBuyerId() { return buyerId; }
    public void setBuyerId(String buyerId) { this.buyerId = buyerId; }

    public String getBuyerNickname() { return buyerNickname; }
    public void setBuyerNickname(String buyerNickname) { this.buyerNickname = buyerNickname; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getReviewContent() { return reviewContent; }
    public void setReviewContent(String reviewContent) { this.reviewContent = reviewContent; }

    public String getReviewThumb() { return reviewThumb; }
    public void setReviewThumb(String reviewThumb) { this.reviewThumb = reviewThumb; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Integer getIsDeleted() { return isDeleted; }
    public void setIsDeleted(Integer isDeleted) { this.isDeleted = isDeleted; }

    public Integer getIsPrivate() { return isPrivate; }
    public void setIsPrivate(Integer isPrivate) { this.isPrivate = isPrivate; }
}
