package com.stacklens.repository;

import com.stacklens.model.ScanJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScanJobRepository extends JpaRepository<ScanJob, String> {
    List<ScanJob> findTop20ByOrderByCreatedAtDesc();
    List<ScanJob> findByDomainOrderByCreatedAtDesc(String domain);
}
