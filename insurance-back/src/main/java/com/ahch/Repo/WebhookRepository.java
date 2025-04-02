package com.ahch.Repo;

import com.ahch.entity.Webhook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WebhookRepository extends JpaRepository<Webhook, Long> {

    List<Webhook> findByEventTypeAndActiveTrue(String eventType);

    List<Webhook> findByActiveTrue();
}