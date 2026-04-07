package kr.co.iei.support.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.iei.support.model.dao.SupportDao;

@Service
public class SupportService {
	@Autowired
	private SupportDao supportDao;
}
