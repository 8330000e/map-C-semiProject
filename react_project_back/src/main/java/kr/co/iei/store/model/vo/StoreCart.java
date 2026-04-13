package kr.co.iei.store.model.vo;

import java.util.Date;

import org.apache.ibatis.type.Alias;

@Alias("storeCart")
public class StoreCart {

    private Long cartNo;
    private String memberId;
    private Long marketNo;
    private Integer quantity;
    private Date addedAt;

    private String marketTitle;
    private String productThumb;
    private Integer productPrice;

    public Long getCartNo() {
        return cartNo;
    }

    public void setCartNo(Long cartNo) {
        this.cartNo = cartNo;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public Long getMarketNo() {
        return marketNo;
    }

    public void setMarketNo(Long marketNo) {
        this.marketNo = marketNo;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Date getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(Date addedAt) {
        this.addedAt = addedAt;
    }

    public String getMarketTitle() {
        return marketTitle;
    }

    public void setMarketTitle(String marketTitle) {
        this.marketTitle = marketTitle;
    }

    public String getProductThumb() {
        return productThumb;
    }

    public void setProductThumb(String productThumb) {
        this.productThumb = productThumb;
    }

    public Integer getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(Integer productPrice) {
        this.productPrice = productPrice;
    }
}
