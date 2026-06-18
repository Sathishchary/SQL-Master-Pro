package com.sqlmasterpro.controller;

import com.sqlmasterpro.model.dto.response.ApiResponse;
import com.sqlmasterpro.model.entity.Certificate;
import com.sqlmasterpro.security.UserPrincipal;
import com.sqlmasterpro.service.CertificateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
@Tag(name = "Certificates", description = "Certificate management APIs")
public class CertificateController {

    private final CertificateService certificateService;

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get my certificates")
    public ResponseEntity<ApiResponse<List<Certificate>>> getMyCertificates(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(certificateService.getMyCertificates(principal.getId())));
    }

    @PostMapping("/issue/{courseId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Issue a certificate for completed course")
    public ResponseEntity<ApiResponse<Certificate>> issueCertificate(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Certificate cert = certificateService.issueCertificate(courseId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Certificate issued successfully", cert));
    }

    @GetMapping("/verify/{certNumber}")
    @Operation(summary = "Verify a certificate by number")
    public ResponseEntity<ApiResponse<Certificate>> verifyCertificate(@PathVariable String certNumber) {
        return ResponseEntity.ok(ApiResponse.success(certificateService.verifyCertificate(certNumber)));
    }
}
