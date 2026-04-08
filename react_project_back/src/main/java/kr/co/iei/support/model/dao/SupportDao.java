package kr.co.iei.support.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.co.iei.admin.model.vo.Faq;
import kr.co.iei.admin.model.vo.Notice;

@Mapper
public interface SupportDao {

	List<Faq> selectFaqList(String category);

	List<Notice> selectNoticeList(String category);

	Notice selectNoticeDetail(Integer noticeNo);

}
