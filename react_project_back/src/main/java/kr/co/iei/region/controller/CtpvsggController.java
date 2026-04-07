package kr.co.iei.region.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.iei.region.model.service.CtpvsggService;
import kr.co.iei.region.model.vo.Ctpvsgg;

@RestController
@RequestMapping("/api/regions")
public class CtpvsggController {
    private final CtpvsggService ctpvsggService;

    public CtpvsggController(CtpvsggService ctpvsggService) {
        this.ctpvsggService = ctpvsggService;
    }

    @GetMapping
    public ResponseEntity<List<Ctpvsgg>> getRegions() {
        return ResponseEntity.ok(ctpvsggService.getAllRegions());
    }
}
