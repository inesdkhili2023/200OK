package com.ahch.controller;

import com.ahch.entity.Webhook;
import com.ahch.service.WebhookService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
@CrossOrigin(origins = "http://localhost:4200")
public class WebhookController {

    private final WebhookService webhookService;

    public WebhookController(WebhookService webhookService) {
        this.webhookService = webhookService;
    }

    @GetMapping
    public ResponseEntity<List<Webhook>> getAllWebhooks() {
        List<Webhook> webhooks = webhookService.getAllWebhooks();
        return ResponseEntity.ok(webhooks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Webhook> getWebhookById(@PathVariable Long id) {
        try {
            Webhook webhook = webhookService.getWebhookById(id);
            return ResponseEntity.ok(webhook);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Webhook> createWebhook(@Valid @RequestBody Webhook webhook) {
        Webhook createdWebhook = webhookService.createWebhook(webhook);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdWebhook);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Webhook> updateWebhook(
            @PathVariable Long id,
            @Valid @RequestBody Webhook webhook) {
        try {
            Webhook updatedWebhook = webhookService.updateWebhook(id, webhook);
            return ResponseEntity.ok(updatedWebhook);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWebhook(@PathVariable Long id) {
        try {
            webhookService.deleteWebhook(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/trigger/{eventType}")
    public ResponseEntity<Map<String, String>> triggerWebhooks(
            @PathVariable String eventType,
            @RequestBody Map<String, Object> payload) {

        webhookService.triggerWebhooks(eventType, payload);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Webhook trigger initiated");
        response.put("event", eventType);

        return ResponseEntity.accepted().body(response);
    }
}