package com.example.demo.services;

import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class SmsAppointmentService {

        @Value("${twilio.account.sid}")
        private String accountSid;

        @Value("${twilio.auth.token}")
        private String authToken;

        @Value("${twilio.phone.number}")
        private String twilioPhoneNumber;

        // Send SMS via Twilio API
        public void sendSms(String toPhoneNumber, String messageContent) {
                try {
                        // Vérifier si les valeurs sont bien récupérées
                        System.out.println("➡ To: " + toPhoneNumber);
                        System.out.println("➡ From: " + twilioPhoneNumber);
                        System.out.println("➡ Message: " + messageContent);
                        // Initialize Twilio SDK
                        Twilio.init(accountSid, authToken);
                        System.out.println("Twilio initialized.");

                        // Log the values for debugging
                        System.out.println("Twilio SID: " + accountSid);
                        System.out.println("Twilio Auth Token: " + authToken);
                        System.out.println("Twilio Phone Number: " + twilioPhoneNumber);

                        // Send the SMS message
                        Message message = Message.creator(
                                new PhoneNumber(toPhoneNumber),
                                new PhoneNumber(twilioPhoneNumber),
                                messageContent
                        ).create();

                        // Log the SID of the sent message
                        System.out.println("Message SID: " + message.getSid());
                } catch (Exception e) {
                        // Handle and log any exceptions
                        System.out.println("Error sending SMS: " + e.getMessage());
                        e.printStackTrace();
                }
        }
}



