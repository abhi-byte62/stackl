package com.stacklens.controller;

import com.stacklens.model.ScanJob;
import com.stacklens.service.ScanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ScanController {

    private final ScanService scanService;

    public ScanController(ScanService scanService) {
        this.scanService = scanService;
    }

    @PostMapping("/scan")
    public ResponseEntity<?> createScan(@RequestBody Map<String, String> request) {
        String url = request.get("url");
        if (url == null || url.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "URL field is required"));
        }

        try {
            ScanJob job = scanService.submitScan(url);
            return ResponseEntity.ok(job);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/scan/{id}")
    public ResponseEntity<?> getScanById(@PathVariable String id) {
        return scanService.getScan(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/scan/history")
    public ResponseEntity<List<ScanJob>> getHistory() {
        return ResponseEntity.ok(scanService.getRecentHistory());
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "StackLens Engineering Intelligence API",
                "version", "2.0.0"
        ));
    }
}
