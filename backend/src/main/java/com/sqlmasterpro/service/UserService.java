package com.sqlmasterpro.service;

import com.sqlmasterpro.model.dto.request.UpdateProfileRequest;
import com.sqlmasterpro.model.entity.User;

public interface UserService {
    User getById(Long id);
    User updateProfile(Long id, UpdateProfileRequest request);
}
