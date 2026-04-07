package kr.co.iei.admin.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.admin.model.vo.DashData;
import kr.co.iei.admin.model.vo.Faq;
import kr.co.iei.admin.model.vo.Notice;

@Mapper
public interface AdminDao {

	int insertNotice(Notice notice);

	List<Notice> selectNoticeList();

	int editNotice(Notice notice);

	DashData getDashData();

	int deleteNotice(Integer noticeNo);

	List<Faq> selectFaqList();





	

}
