package com.stacklens.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stacklens.model.ScanJob;
import com.stacklens.model.ScanStatus;
import com.stacklens.repository.ScanJobRepository;
import com.stacklens.security.SsrfProtectionValidator;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.Instant;
import java.util.*;

@Service
public class ScanService {

    private final ScanJobRepository scanJobRepository;
    private final SsrfProtectionValidator ssrfValidator;
    private final HttpInspectionService httpService;
    private final DnsInspectionService dnsService;
    private final ObjectMapper objectMapper;

    public ScanService(ScanJobRepository scanJobRepository,
                       SsrfProtectionValidator ssrfValidator,
                       HttpInspectionService httpService,
                       DnsInspectionService dnsService,
                       ObjectMapper objectMapper) {
        this.scanJobRepository = scanJobRepository;
        this.ssrfValidator = ssrfValidator;
        this.httpService = httpService;
        this.dnsService = dnsService;
        this.objectMapper = objectMapper;
    }

    public ScanJob submitScan(String targetUrl) {
        var validation = ssrfValidator.validate(targetUrl);
        if (!validation.isValid()) {
            throw new IllegalArgumentException(validation.getMessage());
        }

        URI uri = validation.getSanitizedUri();
        String domain = uri.getHost();
        String scanId = "scan_" + UUID.randomUUID().toString().substring(0, 8);

        ScanJob job = new ScanJob(scanId, uri.toString(), domain, ScanStatus.PENDING);
        scanJobRepository.save(job);

        // Execute scan asynchronously
        executeScanAsync(job.getId(), uri);

        return job;
    }

    @Async
    public void executeScanAsync(String scanId, URI uri) {
        long startTime = System.currentTimeMillis();
        Optional<ScanJob> optionalJob = scanJobRepository.findById(scanId);
        if (optionalJob.isEmpty()) return;

        ScanJob job = optionalJob.get();
        job.setStatus(ScanStatus.SCANNING);
        scanJobRepository.save(job);

        try {
            // 1. Inspect HTTP
            var httpResult = httpService.inspect(uri);

            job.setStatus(ScanStatus.ANALYZING);
            scanJobRepository.save(job);

            // 2. Inspect DNS
            var dnsResult = dnsService.inspect(uri.getHost());

            // 3. Assemble results payload
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("id", scanId);
            payload.put("targetUrl", uri.toString());
            payload.put("domain", uri.getHost());
            payload.put("scannedAt", Instant.now().toString());
            payload.put("rawHeaders", httpResult.headers);
            payload.put("detectedScripts", httpResult.scriptUrls);
            payload.put("cookiesFound", httpResult.cookies);

            long duration = System.currentTimeMillis() - startTime;
            job.setScanDurationMs(duration);
            job.setCompletedAt(Instant.now());
            job.setStatus(ScanStatus.COMPLETED);
            job.setResultsJson(objectMapper.writeValueAsString(payload));
            scanJobRepository.save(job);

        } catch (Exception e) {
            job.setStatus(ScanStatus.FAILED);
            job.setErrorMessage("Scan failure: " + e.getMessage());
            job.setCompletedAt(Instant.now());
            scanJobRepository.save(job);
        }
    }

    public Optional<ScanJob> getScan(String id) {
        return scanJobRepository.findById(id);
    }

    public List<ScanJob> getRecentHistory() {
        return scanJobRepository.findTop20ByOrderByCreatedAtDesc();
    }
}
