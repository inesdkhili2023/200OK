package com.ahch.controller;

import com.ahch.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test-email")
public class TestEmailController {
    @Autowired
    private EmailService emailService;

    @GetMapping
    public String testEmail() {
        emailService.envoyerMailConfirmation("ines.dkhili@esprit.tn", "Test", "User");
        return "Email de test envoyé!";
    }
}
