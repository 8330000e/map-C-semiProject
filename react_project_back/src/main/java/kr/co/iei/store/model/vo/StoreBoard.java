package kr.co.iei.store.model.vo;

import java.util.Date;

public class StoreBoard {

	private Long marketNo;
	private Long boardNo;
	private String memberId;
	private String ctpvsggId;
	private String regionName;
	private String marketTitle;
	private String marketContent;
	private Integer productPrice;
	private String productThumb;
	private Integer productStatus;
	private Integer readCount;
	private Integer isDeleted;
	private Date createdAt;
	private String tradeType;

	public Long getMarketNo() { return marketNo; }
	public void setMarketNo(Long marketNo) { this.marketNo = marketNo; }

	public Long getBoardNo() { return boardNo; }
	public void setBoardNo(Long boardNo) { this.boardNo = boardNo; }

	public String getMemberId() { return memberId; }
	public void setMemberId(String memberId) { this.memberId = memberId; }

	public String getCtpvsggId() { return ctpvsggId; }
	public void setCtpvsggId(String ctpvsggId) { this.ctpvsggId = ctpvsggId; }

	public String getRegionName() { return regionName; }
	public void setRegionName(String regionName) { this.regionName = regionName; }

	public String getMarketTitle() { return marketTitle; }
	public void setMarketTitle(String marketTitle) { this.marketTitle = marketTitle; }

	public String getMarketContent() { return marketContent; }
	public void setMarketContent(String marketContent) { this.marketContent = marketContent; }

	public Integer getProductPrice() { return productPrice; }
	public void setProductPrice(Integer productPrice) { this.productPrice = productPrice; }

	public String getProductThumb() { return productThumb; }
	public void setProductThumb(String productThumb) { this.productThumb = productThumb; }

	public Integer getProductStatus() { return productStatus; }
	public void setProductStatus(Integer productStatus) { this.productStatus = productStatus; }

	public Integer getReadCount() { return readCount; }
	public void setReadCount(Integer readCount) { this.readCount = readCount; }

	public Integer getIsDeleted() { return isDeleted; }
	public void setIsDeleted(Integer isDeleted) { this.isDeleted = isDeleted; }

	public Date getCreatedAt() { return createdAt; }
	public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

	public String getTradeType() { return tradeType; }
	public void setTradeType(String tradeType) { this.tradeType = tradeType; }

	@Override
	public String toString() {
		return "StoreBoard{marketNo=" + marketNo + ", marketTitle='" + marketTitle + "'}";
	}
}
