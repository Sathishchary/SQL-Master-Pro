package com.sqlmasterpro.service;

import com.sqlmasterpro.model.dto.response.CustomTableResponse;
import org.springframework.web.multipart.MultipartFile;

public interface CustomTableService {
    CustomTableResponse uploadCustomTable(Long userId, MultipartFile file);
    void removeCustomTable(Long userId);
}
