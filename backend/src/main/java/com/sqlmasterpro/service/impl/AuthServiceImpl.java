package com.sqlmasterpro.service.impl;

import com.sqlmasterpro.exception.BadRequestException;
import com.sqlmasterpro.exception.ResourceNotFoundException;
import com.sqlmasterpro.model.dto.request.LoginRequest;
import com.sqlmasterpro.model.dto.request.RegisterRequest;
import com.sqlmasterpro.model.dto.response.AuthResponse;
import com.sqlmasterpro.model.entity.Role;
import com.sqlmasterpro.model.entity.User;
import com.sqlmasterpro.model.enums.AuthProvider;
import com.sqlmasterpro.repository.RoleRepository;
import com.sqlmasterpro.repository.UserRepository;
import com.sqlmasterpro.security.JwtTokenProvider;
import com.sqlmasterpro.security.UserPrincipal;
import com.sqlmasterpro.service.AuthService;
import com.sqlmasterpro.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        Role studentRole = roleRepository.findByName("ROLE_STUDENT")
            .orElseThrow(() -> new ResourceNotFoundException("Default role not found"));

        String verificationToken = UUID.randomUUID().toString();

        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .authProvider(AuthProvider.LOCAL)
            .emailVerificationToken(verificationToken)
            .roles(new HashSet<>(Set.of(studentRole)))
            .build();

        userRepository.save(user);
        emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), verificationToken);

        log.info("New user registered: {}", user.getEmail());

        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        return buildAuthResponse(auth, user);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmailOrUsername(), request.getPassword()));

        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        User user = userRepository.findById(principal.getId())
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setLastActive(LocalDate.now());
        userRepository.save(user);

        return buildAuthResponse(auth, user);
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
            .orElseThrow(() -> new BadRequestException("Invalid verification token"));
        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        String resetToken = UUID.randomUUID().toString();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), resetToken);
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByPasswordResetToken(token)
            .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        if (user.getPasswordResetExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpiry(null);
        userRepository.save(user);
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid refresh token");
        }
        Long userId = tokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        return buildAuthResponse(auth, user);
    }

    @Override
    public void logout(Long userId) {
        log.info("User {} logged out", userId);
    }

    private AuthResponse buildAuthResponse(Authentication auth, User user) {
        String accessToken = tokenProvider.generateToken(auth);
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());

        Set<String> roles = auth.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toSet());

        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .userId(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .profilePicture(user.getProfilePicture())
            .roles(roles)
            .subscriptionPlan(user.getSubscriptionPlan().name())
            .emailVerified(user.isEmailVerified())
            .build();
    }
}
