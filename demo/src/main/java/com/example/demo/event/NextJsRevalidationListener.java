package com.example.demo.event;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class NextJsRevalidationListener {

    private final RestTemplate restTemplate;

    @Value("${nextjs.revalidate.url:http://localhost:3000/api/revalidate}")
    private String revalidateUrl;

    @Value("${nextjs.revalidate.secret:}")
    private String revalidateSecret;

    public NextJsRevalidationListener(RestTemplateBuilder builder) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(3))
                .setReadTimeout(Duration.ofSeconds(5))
                .build();
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onContentChanged(ContentChangedEvent event) {
        if (revalidateSecret == null || revalidateSecret.isBlank()) {
            log.debug("NEXTJS_REVALIDATE_SECRET not set, skipping Next.js revalidation webhook");
            return;
        }

        Map<String, String> body = new HashMap<>();
        body.put("type", event.type());
        if (event.slug() != null) {
            body.put("slug", event.slug());
        }
        if (event.oldSlug() != null) {
            body.put("oldSlug", event.oldSlug());
        }
        if (event.categorySlug() != null) {
            body.put("categorySlug", event.categorySlug());
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-revalidate-secret", revalidateSecret);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        // Retry loop: 3 attempts with exponential backoff (1s, 2s, 4s)
        int maxRetries = 3;
        int attempt = 0;
        long backoff = 1000L;

        while (attempt < maxRetries) {
            attempt++;
            try {
                ResponseEntity<String> response = restTemplate.postForEntity(revalidateUrl, request, String.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    log.info("Successfully revalidated Next.js cache for type: {}, slug: {}", event.type(), event.slug());
                    return;
                } else {
                    log.warn("Next.js revalidate returned status {} on attempt {}", response.getStatusCode(), attempt);
                }
            } catch (Exception e) {
                log.warn("Attempt {}/{} failed to revalidate Next.js cache ({}): {}", 
                        attempt, maxRetries, revalidateUrl, e.getMessage());
            }

            if (attempt < maxRetries) {
                try {
                    Thread.sleep(backoff);
                    backoff *= 2;
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }

        log.error("All {} attempts to revalidate Next.js cache failed for type: {}, slug: {}", 
                maxRetries, event.type(), event.slug());
    }
}
