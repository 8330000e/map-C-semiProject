package kr.co.iei.board.model.vo;

import org.apache.ibatis.type.Alias;

import kr.co.iei.board.model.vo.BoardReport;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value="boardReport")
public class BoardReport {
		private Integer reportNo;
		private Integer boardNo;
		private String reportId;
		private String reportCategory;
		private String reportContent;
		private String reportDate;
		private Integer reportStatus;
}
