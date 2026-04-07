package kr.co.iei.admin.model.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.admin.model.dao.AdminDao;
import kr.co.iei.admin.model.vo.DashData;
import kr.co.iei.admin.model.vo.Faq;
import kr.co.iei.admin.model.vo.Notice;

@Service
public class AdminService {
	@Autowired
	private AdminDao adminDao;

	@Transactional
	public int insertNotice(Notice notice) {
		int result = adminDao.insertNotice(notice);
		return result;
	}

	public List<Notice> selectNoticeList() {
		List<Notice> noticeList = adminDao.selectNoticeList();
		return noticeList;
	}

	@Transactional
	public int editNotice(Notice notice) {
		int result = adminDao.editNotice(notice);
		return result;
	}

	public DashData getDashData() {
		DashData dashData = adminDao.getDashData();
		System.out.println(dashData);
		return dashData;
	}

	

	@Transactional
	public int deleteNotice(Integer noticeNo) {
		int result = adminDao.deleteNotice(noticeNo);
		return result;
	}

	public List<Faq> selectFaqList() {
		List<Faq> faqList = adminDao.selectFaqList();
		return faqList;
	}
}
