package kr.co.iei.member.model.vo;

import java.sql.Date;

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
    private Integer memberStatus = 1;      // 기본값 1
    private Integer mannerScore = 0;       // 기본값 0
    private Integer tradeCount = 0;        // 기본값 0

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public String getMemberPw() {
        return memberPw;
    }

    public void setMemberPw(String memberPw) {
        this.memberPw = memberPw;
    }
}