package kr.co.iei.region.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.region.model.vo.Ctpvsgg;

@Mapper
public interface CtpvsggDao {
    List<Ctpvsgg> selectAllRegions();
}
