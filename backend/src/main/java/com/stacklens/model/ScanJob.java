package com.stacklens.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "scan_jobs", indexes = {
    @Index(name = "idx_scan_domain", columnList = "domain"),
    @Index(name = "idx_scan_status", columnList = "status"),
    @Index(name = "idx_scan_created", columnList = "createdAt")
})
public class ScanJob {

    @Id
    private String id;

    @Column(nullable = false, length = 1000)
    private String targetUrl;

    @Column(nullable = false, length = 255)
    private String domain;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ScanStatus status;

    private Long scanDurationMs;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    @Column(columnDefinition = "TEXT")
    private String resultsJson;

    private Instant createdAt;
    private Instant completedAt;

    public ScanJob() {}

    public ScanJob(String id, String targetUrl, String domain, ScanStatus status) {
        this.id = id;
        this.targetUrl = targetUrl;
        this.domain = domain;
        this.status = status;
        this.createdAt = Instant.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    public void setTargetUrl(String targetUrl) {
        this.targetUrl = targetUrl;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public ScanStatus getStatus() {
        return status;
    }

    public void setStatus(ScanStatus status) {
        this.status = status;
    }

    public Long getScanDurationMs() {
        return scanDurationMs;
    }

    public void setScanDurationMs(Long scanDurationMs) {
        this.scanDurationMs = scanDurationMs;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getResultsJson() {
        return resultsJson;
    }

    public void setResultsJson(String resultsJson) {
        this.resultsJson = resultsJson;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }
}
