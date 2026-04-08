package kr.co.iei.region.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class RegionScheduler {

    private final RegionService regionService;

    @Autowired
    public RegionScheduler(RegionService regionService) {
        this.regionService = regionService;
    }

    // 매주 월요일 00:00 실행
    @Scheduled(cron = "0 0 0 ? * MON")
    public void resetWeeklyTree() {
        System.out.println("주간 나무 초기화 실행");
        regionService.resetWeeklyTree();
    }
}