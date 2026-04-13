package kr.co.iei.board.model.vo;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias("boardComment")
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BoardComment {
    private Long commentNo;
    private Integer boardNo;
    private String memberId;
    private String memberNickname;
    private String memberThumb;
    private String content;
    private String createdAt;
    private String updatedAt;
    private Long parentCommentNo;
    private Long commentGroup;
    private Integer commentDepth;
    private Integer isSecret;
}
