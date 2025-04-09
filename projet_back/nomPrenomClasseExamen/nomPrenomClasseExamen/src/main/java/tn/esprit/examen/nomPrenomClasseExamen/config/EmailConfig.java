package tn.esprit.examen.nomPrenomClasseExamen.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;
@Configuration
public class EmailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        // Configurer l'hôte et le port du serveur SMTP d'Outlook
        mailSender.setHost("smtp.office365.com");
        mailSender.setPort(587);

        // Fournir les informations d'authentification
        mailSender.setUsername("Omayma.SELLAMI@esprit.tn");  // L'adresse e-mail de l'admin
        mailSender.setPassword("hhxtbhjzxxksvgkp");  // Remplace avec le mot de passe d'application

        // Configurer les propriétés du serveur SMTP
        Properties properties = mailSender.getJavaMailProperties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.starttls.required", "true");
        properties.put("mail.smtp.ssl.trust", "smtp.office365.com");

        return mailSender;
    }
}
