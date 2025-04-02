package com.ahch.service;

import com.ahch.Repo.WebhookRepository;
import com.ahch.entity.Webhook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class WebhookService {

    private static final Logger logger = LoggerFactory.getLogger(WebhookService.class);
    private final WebhookRepository webhookRepository;
    private final RestTemplate restTemplate;

    public WebhookService(WebhookRepository webhookRepository) {
        this.webhookRepository = webhookRepository;
        this.restTemplate = new RestTemplate();
    }

    public List<Webhook> getAllWebhooks() {
        return webhookRepository.findAll();
    }

    public Webhook getWebhookById(Long id) {
        return webhookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Webhook not found with id: " + id));
    }

    public Webhook createWebhook(Webhook webhook) {
        // Generate a secret key if not provided
        if (webhook.getSecretKey() == null || webhook.getSecretKey().isEmpty()) {
            webhook.setSecretKey(UUID.randomUUID().toString());
        }
        return webhookRepository.save(webhook);
    }

    public Webhook updateWebhook(Long id, Webhook webhookDetails) {
        Webhook webhook = getWebhookById(id);
        webhook.setName(webhookDetails.getName());
        webhook.setUrl(webhookDetails.getUrl());
        webhook.setEventType(webhookDetails.getEventType());
        webhook.setActive(webhookDetails.isActive());

        if (webhookDetails.getSecretKey() != null && !webhookDetails.getSecretKey().isEmpty()) {
            webhook.setSecretKey(webhookDetails.getSecretKey());
        }

        return webhookRepository.save(webhook);
    }

    public void deleteWebhook(Long id) {
        webhookRepository.deleteById(id);
    }

    /**
     * Trigger all webhooks for a specific event
     */
    @Async
    public void triggerWebhooks(String eventType, Map<String, Object> payload) {
        List<Webhook> webhooks = webhookRepository.findByEventTypeAndActiveTrue(eventType);

        for (Webhook webhook : webhooks) {
            triggerWebhook(webhook, payload);
        }
    }

    /**
     * Trigger a specific webhook
     */
    private void triggerWebhook(Webhook webhook, Map<String, Object> payload) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Add a signature header if we have a secret key
            if (webhook.getSecretKey() != null && !webhook.getSecretKey().isEmpty()) {
                headers.set("X-Webhook-Signature", generateSignature(payload, webhook.getSecretKey()));
            }

            headers.set("X-Webhook-ID", webhook.getId().toString());
            headers.set("X-Webhook-Event", webhook.getEventType());

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            // Make the HTTP request
            restTemplate.postForEntity(webhook.getUrl(), request, String.class);

            // Update the last triggered time
            webhook.setLastTriggeredAt(LocalDateTime.now());
            webhookRepository.save(webhook);

            logger.info("Webhook triggered: {} for event {}", webhook.getName(), webhook.getEventType());
        } catch (Exception e) {
            logger.error("Error triggering webhook: " + webhook.getName(), e);
        }
    }

    /**
     * Generate a signature for the webhook payload
     */
    private String generateSignature(Map<String, Object> payload, String secretKey) {
        // This is a simple implementation - in a real-world scenario,
        // you would use HMAC-SHA256 or similar to create a proper signature
        String payloadStr = payload.toString() + secretKey;
        return UUID.nameUUIDFromBytes(payloadStr.getBytes()).toString();
    }
}