package kr.co.iei.admin.model.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.iei.admin.model.dao.AdminDao;
import kr.co.iei.admin.model.vo.DashData;
import kr.co.iei.admin.model.vo.Faq;
import kr.co.iei.admin.model.vo.Notice;
import kr.co.iei.admin.model.vo.Qna;
import kr.co.iei.utils.FileUtils;

@Service
public class AdminService {
	@Autowired
	private AdminDao adminDao;
	
	@Autowired
	private FileUtils fileUtils;
	
	@Value("${file.root}")
	private String root;
	

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

	@Transactional
	public int insertFaq(Faq faq) {
		int result = adminDao.insertFaq(faq);
		return result;
	}

	@Transactional
	public int editFaq(Faq faq) {
		int result = adminDao.editFaq(faq);
		return result;
	}

	public List<Qna> selectQnaList() {
		List<Qna> qnaList = adminDao.selectQnaList();
		return qnaList;
	}

	@Transactional
	public int qnaAnswer(Qna qna) {
		if (qna.getQnaImage() != null) {
			String filepath = fileUtils.upload(root + "qna/", qna.getQnaImage());
			qna.setQnaImagePath(filepath);
		}
		return adminDao.qnaAnswer(qna);
	}
}
