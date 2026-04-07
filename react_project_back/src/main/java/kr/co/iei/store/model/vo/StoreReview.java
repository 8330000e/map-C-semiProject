package kr.co.iei.store.model.vo;

import java.util.Date;

public class StoreReview {

    private Long reviewNo;
    private Long marketNo;
    private String memberId;
    private String memberNickname;
    private String reviewContent;
    private Long parentCommentNo;
    private Long commentGroup;
    private Integer commentDepth;
    private Integer isPrivate;
    private Date createdAt;
    private Date updatedAt;
    private Integer isDeleted;

    public Long getReviewNo() { return reviewNo; }
    public void setReviewNo(Long reviewNo) { this.reviewNo = reviewNo; }

    public Long getMarketNo() { return marketNo; }
    public void setMarketNo(Long marketNo) { this.marketNo = marketNo; }

    public String getMemberId() { return memberId; }
    public void setMemberId(String memberId) { this.memberId = memberId; }

    public String getMemberNickname() { return memberNickname; }
    public void setMemberNickname(String memberNickname) { this.memberNickname = memberNickname; }

    public String getReviewContent() { return reviewContent; }
    public void setReviewContent(String reviewContent) { this.reviewContent = reviewContent; }

    public Long getParentCommentNo() { return parentCommentNo; }
    public void setParentCommentNo(Long parentCommentNo) { this.parentCommentNo = parentCommentNo; }

    public Long getCommentGroup() { return commentGroup; }
    public void setCommentGroup(Long commentGroup) { this.commentGroup = commentGroup; }

    public Integer getCommentDepth() { return commentDepth; }
    public void setCommentDepth(Integer commentDepth) { this.commentDepth = commentDepth; }

    public Integer getIsPrivate() { return isPrivate; }
    public void setIsPrivate(Integer isPrivate) { this.isPrivate = isPrivate; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public Integer getIsDeleted() { return isDeleted; }
    public void setIsDeleted(Integer isDeleted) { this.isDeleted = isDeleted; }

    @Override
    public String toString() {
        return "StoreReview{reviewNo=" + reviewNo + ", marketNo=" + marketNo
                + ", memberId='" + memberId + "'}";
    }
}
