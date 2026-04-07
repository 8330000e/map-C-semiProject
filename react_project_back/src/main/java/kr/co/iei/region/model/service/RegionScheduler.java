package kr.co.iei.region.model.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RegionScheduler {

    private final RegionService regionService;

    // 매주 월요일 00:00 실행
    @Scheduled(cron = "0 0 0 ? * MON")
    public void resetWeeklyTree() {
        System.out.println("주간 나무 초기화 실행");
        regionService.resetWeeklyTree();
    }
}