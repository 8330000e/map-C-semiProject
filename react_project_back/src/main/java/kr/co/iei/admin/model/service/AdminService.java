package kr.co.iei.admin.model.service;

import java.beans.Transient;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.admin.model.dao.AdminDao;
import kr.co.iei.admin.model.vo.Notice;

@Service
public class AdminService {
	@Autowired
	private AdminDao adminDao;

	@Transient
	public int insertNotice(Notice notice) {
		int result = adminDao.insertNotice(notice);
		return result;
	}

	public List<Notice> selectNoticeList() {
		List<Notice> noticeList = adminDao.selectNoticeList();
		return noticeList;
	}

	@Transient
	public int editNotice(Notice notice) {
		int result = adminDao.editNotice(notice);
		return result;
	}
}
