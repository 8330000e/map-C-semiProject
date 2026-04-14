package kr.co.iei.donation.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.donation.model.vo.PointDonation;

@Mapper
public interface DonationDao {

	int updateMemberPoint(PointDonation donation);

	int updateGroupTotalPoint(PointDonation donation);

	int insertPointRecordResult(PointDonation donation);
	
}
