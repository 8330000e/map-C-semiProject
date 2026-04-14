package kr.co.iei.donation.model.vo;

import java.util.Date;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data

public class PointDonation {
	private Integer donationNo;
	private String memberId;
	private String groupId;
	private Integer donationPoint;
	private Integer donationCash;
	private Date donationDate;

}
