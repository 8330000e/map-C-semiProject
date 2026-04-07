package kr.co.iei.admin.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="faq")
public class Faq {
	private Integer faqNo;
	private String faqTitle;
	private String faqContent;
	private String faqCategory;
}
