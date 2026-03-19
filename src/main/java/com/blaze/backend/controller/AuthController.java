package com.blaze.backend.controller;

import com.blaze.backend.dto.AuthRequest;
import com.blaze.backend.dto.AuthResponse;
import com.blaze.backend.dto.ChangePasswordRequest;
import com.blaze.backend.dto.RegisterRequest;
import com.blaze.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request, Principal principal) {
        authService.changePassword(principal.getName(), request);
        return ResponseEntity.ok("Password changed successfully.");
    }

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody Map<String, String> body) {
        authService.sendForgotPasswordOtp(body.get("email"));
        return ResponseEntity.ok("OTP sent to your email.");
    }

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> body) {
        authService.verifyOtpAndResetPassword(body.get("email"), body.get("code"), body.get("newPassword"));
        return ResponseEntity.ok("Password reset successfully.");
    }
}
