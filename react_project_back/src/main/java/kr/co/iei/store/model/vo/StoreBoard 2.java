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
    private String tradeType;

    private String memberId;
    private String memberNickname;
    private String ctpvsggId;
    private String ctpvNm;
    private String sggNm;
    private String regionName;
    private String marketTitle;
    private String marketContent;
    private Integer productStatus;
    private String productThumb;

    private Date createdAt;
    private Date updatedAt;

    public Long getMarketNo() {
        return marketNo;
    }

    public void setMarketNo(Long marketNo) {
        this.marketNo = marketNo;
    }

    public Long getBoardNo() {
        return boardNo;
    }

    public void setBoardNo(Long boardNo) {
        this.boardNo = boardNo;
    }

    public Long getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(Long productPrice) {
        this.productPrice = productPrice;
    }

    public Integer getReadCount() {
        return readCount;
    }

    public void setReadCount(Integer readCount) {
        this.readCount = readCount;
    }

    public Integer getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Integer isDeleted) {
        this.isDeleted = isDeleted;
    }

    public String getTradeType() {
        return tradeType;
    }

    public void setTradeType(String tradeType) {
        this.tradeType = tradeType;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public String getMemberNickname() {
        return memberNickname;
    }

    public void setMemberNickname(String memberNickname) {
        this.memberNickname = memberNickname;
    }

    public String getCtpvsggId() {
        return ctpvsggId;
    }

    public void setCtpvsggId(String ctpvsggId) {
        this.ctpvsggId = ctpvsggId;
    }

    public String getCtpvNm() {
        return ctpvNm;
    }

    public void setCtpvNm(String ctpvNm) {
        this.ctpvNm = ctpvNm;
    }

    public String getSggNm() {
        return sggNm;
    }

    public void setSggNm(String sggNm) {
        this.sggNm = sggNm;
    }

    public String getRegionName() {
        return regionName;
    }

    public void setRegionName(String regionName) {
        this.regionName = regionName;
    }

    public String getMarketTitle() {
        return marketTitle;
    }

    public void setMarketTitle(String marketTitle) {
        this.marketTitle = marketTitle;
    }

    public String getMarketContent() {
        return marketContent;
    }

    public void setMarketContent(String marketContent) {
        this.marketContent = marketContent;
    }

    public Integer getProductStatus() {
        return productStatus;
    }

    public void setProductStatus(Integer productStatus) {
        this.productStatus = productStatus;
    }

    public String getProductThumb() {
        return productThumb;
    }

    public void setProductThumb(String productThumb) {
        this.productThumb = productThumb;
    }
}