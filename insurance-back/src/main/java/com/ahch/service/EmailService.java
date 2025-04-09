package com.ahch.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;  // Correct import
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.net.ssl.SSLException;
import java.util.Objects;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void envoyerMailConfirmation(String to, String nom, String prenom) {
        try {
            logger.info("Preparing email to: {}", to);

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Confirmation de votre demande d'assurance santé");

            String texte = String.format(
                    "Bonjour %s %s,\n\nVotre demande a bien été reçue.\n" +
                            "Nous vous contacterons prochainement pour fixer un rendez-vous.\n\n" +
                            "Cordialement,\nL'équipe Assurance",
                    prenom, nom
            );

            message.setText(texte);

            mailSender.send(message);
            logger.info("Email sent successfully to {}", to);
        } catch (MailSendException e) {
            if (e.getCause() instanceof SSLException) {
                logger.error("SSL Handshake failed. Please verify:");
                logger.error("1. TLS configuration in application.properties");
                logger.error("2. Network security settings");
                logger.error("3. Java security policies");
            }
            throw new RuntimeException("Échec d'envoi d'email: " + e.getMessage(), e);
        }
    }

}