package com.sqlmasterpro.service;

import com.sqlmasterpro.model.entity.Certificate;

import java.util.List;

public interface CertificateService {
    List<Certificate> getMyCertificates(Long userId);
    Certificate issueCertificate(Long courseId, Long userId);
    Certificate verifyCertificate(String certNumber);
}
