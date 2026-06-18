package com.sqlmasterpro.service;

import com.sqlmasterpro.model.dto.request.LoginRequest;
import com.sqlmasterpro.model.dto.request.RegisterRequest;
import com.sqlmasterpro.model.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    void verifyEmail(String token);
    void forgotPassword(String email);
    void resetPassword(String token, String newPassword);
    AuthResponse refreshToken(String refreshToken);
    void logout(Long userId);
}
