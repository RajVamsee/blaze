package com.blaze.backend.service;

import com.blaze.backend.dto.AuthRequest;
import com.blaze.backend.dto.AuthResponse;
import com.blaze.backend.dto.ChangePasswordRequest;
import com.blaze.backend.dto.RegisterRequest;
import com.blaze.backend.entity.OtpToken;
import com.blaze.backend.entity.Role;
import com.blaze.backend.entity.User;
import com.blaze.backend.repository.OtpTokenRepository;
import com.blaze.backend.repository.RoleRepository;
import com.blaze.backend.repository.UserRepository;
import com.blaze.backend.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final OtpTokenRepository otpTokenRepository;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider,
                       OtpTokenRepository otpTokenRepository,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.otpTokenRepository = otpTokenRepository;
        this.emailService = emailService;
    }

    public String register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        Role developerRole = roleRepository.findByName("ROLE_DEVELOPER")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName("ROLE_DEVELOPER");
                    return roleRepository.save(role);
                });

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(developerRole);
        user.setStatus("PENDING");

        userRepository.save(user);

        return "User registered successfully. Awaiting admin approval.";
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        if (!"APPROVED".equals(user.getStatus())) {
            throw new BadCredentialsException("Account not approved. Current status: " + user.getStatus());
        }

        String token = jwtTokenProvider.generateToken(authentication);

        return new AuthResponse(token, user.getUsername(), user.getRole().getName());
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void sendForgotPasswordOtp(String email) {
        User user = userRepository.findAll().stream()
                .filter(u -> email.equalsIgnoreCase(u.getEmail()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No account found with that email address."));

        if (!"APPROVED".equals(user.getStatus())) {
            throw new RuntimeException("This account has not been approved yet.");
        }

        // Invalidate any existing unused OTPs for this email
        otpTokenRepository.findTopByEmailAndUsedFalseOrderByCreatedAtDesc(email)
                .ifPresent(otp -> { otp.setUsed(true); otpTokenRepository.save(otp); });

        String code = String.format("%06d", new SecureRandom().nextInt(999999));

        OtpToken otp = new OtpToken();
        otp.setEmail(email.toLowerCase());
        otp.setCode(code);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpTokenRepository.save(otp);

        emailService.sendOtp(email, code);
    }

    public void verifyOtpAndResetPassword(String email, String code, String newPassword) {
        OtpToken otp = otpTokenRepository.findTopByEmailAndUsedFalseOrderByCreatedAtDesc(email.toLowerCase())
                .orElseThrow(() -> new RuntimeException("No active reset code found. Please request a new one."));

        if (otp.isUsed()) {
            throw new RuntimeException("This code has already been used.");
        }
        if (LocalDateTime.now().isAfter(otp.getExpiresAt())) {
            throw new RuntimeException("This code has expired. Please request a new one.");
        }
        if (!otp.getCode().equals(code)) {
            throw new RuntimeException("Incorrect code. Please check your email and try again.");
        }

        User user = userRepository.findAll().stream()
                .filter(u -> email.equalsIgnoreCase(u.getEmail()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not found."));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        otp.setUsed(true);
        otpTokenRepository.save(otp);
    }
}
