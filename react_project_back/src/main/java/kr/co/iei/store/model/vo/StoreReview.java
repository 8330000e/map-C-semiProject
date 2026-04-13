package kr.co.iei.store.model.vo;

import java.util.Date;

import lombok.Data;

@Data
public class StoreReview {

    private Long reviewNo;
    private Long marketNo;
    private String memberId;
    private String memberNickname;
    private String memberThumb;
    private String reviewContent;
    private Long parentCommentNo;
    private Long commentGroup;
    private Integer commentDepth;
    private Integer isPrivate;
    private Date createdAt;
    private Date updatedAt;
    private Integer isDeleted;
}
