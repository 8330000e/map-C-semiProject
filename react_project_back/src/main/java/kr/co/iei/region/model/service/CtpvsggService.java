package kr.co.iei.region.model.service;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.co.iei.region.model.dao.CtpvsggDao;
import kr.co.iei.region.model.vo.Ctpvsgg;

@Service
public class CtpvsggService {
    private final CtpvsggDao ctpvsggDao;

    public CtpvsggService(CtpvsggDao ctpvsggDao) {
        this.ctpvsggDao = ctpvsggDao;
    }

    public List<Ctpvsgg> getAllRegions() {
        return ctpvsggDao.selectAllRegions();
    }
}
