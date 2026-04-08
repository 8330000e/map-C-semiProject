package kr.co.iei.support.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.admin.model.vo.Faq;
import kr.co.iei.admin.model.vo.Notice;
import kr.co.iei.support.model.dao.SupportDao;

@Service
public class SupportService {
	@Autowired
	private SupportDao supportDao;

	public List<Faq> selectFaqList(String category) {
		List<Faq> faqList = supportDao.selectFaqList(category);
		return faqList;
	}

	public List<Notice> selectNoticeList(String category) {
		List<Notice> noticeList = supportDao.selectNoticeList(category);
		return noticeList;
	}

	public Notice selectNoticeDetail(Integer noticeNo) {
		Notice notice = supportDao.selectNoticeDetail(noticeNo);
		return notice;
	}
}
