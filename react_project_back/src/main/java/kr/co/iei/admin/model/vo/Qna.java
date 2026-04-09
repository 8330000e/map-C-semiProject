package kr.co.iei.admin.model.vo;

import org.apache.ibatis.type.Alias;
import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="qna")
public class Qna {
	private Integer qnaNo;
	private String memberId;
	private String qnaTitle;
	private String qnaContent;
	private String qnaAnswer;
	private Integer qnaStatus;
	private String qnaDate;
	
	private MultipartFile qnaImage;
	private String qnaAnswerImage;
	private String qnaQuestionImage;
	private String qnaCategory;
}
