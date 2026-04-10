package kr.co.iei.member.model.vo;



import java.util.Date;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="member")
public class Member {
    private String memberId;
    private String memberPw;
    private String memberName;
    private Integer memberGrade = 2;        // 기본값 2
    private String memberNickname;          // NOT NULL
    private String memberEmail;
    private String memberThumb;
    private Date enrollDate;                // SYSDATE 사용 예정

    private Integer memberStatus = 0;     // 기본값 1 // 기본값 0임 
    private Integer mannerScore = 0;       // 기본값 0 // 기본값 36.5임 

    private Integer tradeCount = 0;        // 기본값 0
    
    private Integer boardCount;					// 게시글 수 추가 
    private Integer commentCount;				// 댓글 수 추가 
    private Integer reportCount;				// 게시글이 신고당한 횟수 

    public Integer getMemberStatus() {
        return memberStatus;
    }

    public void setMemberStatus(Integer memberStatus) {
        this.memberStatus = memberStatus;
    }
}