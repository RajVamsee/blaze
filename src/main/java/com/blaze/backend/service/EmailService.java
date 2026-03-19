package com.blaze.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Blaze — Your Password Reset Code");
        message.setText(
            "Hi,\n\n" +
            "Your Blaze password reset code is:\n\n" +
            "  " + otpCode + "\n\n" +
            "This code expires in 10 minutes. If you did not request a password reset, ignore this email.\n\n" +
            "— The Blaze Team"
        );
        mailSender.send(message);
    }
}
