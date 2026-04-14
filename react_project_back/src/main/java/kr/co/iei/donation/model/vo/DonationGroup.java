package kr.co.iei.donation.model.vo;

import org.apache.ibatis.type.Alias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Alias(value = "donation")
public class DonationGroup {
	private String groupId;
	private String groupName;
	private String groupDesc;
	private String groupImg;
	private String category;
	private Integer totalPoints;
	private String virtualAccount;
}
