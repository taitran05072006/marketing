#!/bin/bash

CONF_DIR="src/main/java/com/example/demo/config"
SRV_DIR="src/main/java/com/example/demo/service"
IMPL_DIR="src/main/java/com/example/demo/service/impl"
CTRL_DIR="src/main/java/com/example/demo/controller"

# -- PayOS Config --
cat << 'INNER_EOF' > "$CONF_DIR/PayOSConfig.java"
package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vn.payos.PayOS;

@Configuration
public class PayOSConfig {

    @Value("${payos.client-id}")
    private String clientId;

    @Value("${payos.api-key}")
    private String apiKey;

    @Value("${payos.checksum-key}")
    private String checksumKey;

    @Bean
    public PayOS payOS() {
        return new PayOS(clientId, apiKey, checksumKey);
    }
}
INNER_EOF

# -- PaymentService --
cat << 'INNER_EOF' > "$SRV_DIR/PaymentService.java"
package com.example.demo.service;

import com.fasterxml.jackson.databind.node.ObjectNode;
import vn.payos.type.WebhookType;

public interface PaymentService {
    String createPaymentLink(Long orderId);
    void handleWebhook(ObjectNode webhookBody);
}
INNER_EOF

# -- PaymentServiceImpl --
cat << 'INNER_EOF' > "$IMPL_DIR/PaymentServiceImpl.java"
package com.example.demo.service.impl;

import com.example.demo.entity.order.Order;
import com.example.demo.entity.order.OrderStatus;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.OrderRepository;
import com.example.demo.service.PaymentService;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.payos.PayOS;
import vn.payos.type.CheckoutResponseData;
import vn.payos.type.ItemData;
import vn.payos.type.PaymentData;
import vn.payos.type.WebhookData;
import vn.payos.type.WebhookType;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final PayOS payOS;

    @Override
    public String createPaymentLink(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        try {
            // Build PaymentData
            String orderCodeStr = String.valueOf(System.currentTimeMillis() % 1000000); // PayOS requires orderCode as Integer/Long internally
            
            // To properly link PayOS to our system, we should ideally use our internal orderCode (if it's numeric).
            // For this demo, assuming orderCode is random string, we map the PayOS code to order.id
            Long payosOrderCode = order.getId();
            
            ItemData item = ItemData.builder()
                    .name("Order " + order.getOrderCode())
                    .quantity(1)
                    .price(order.getTotalAmount().intValue())
                    .build();

            PaymentData paymentData = PaymentData.builder()
                    .orderCode(payosOrderCode)
                    .amount(order.getTotalAmount().intValue())
                    .description("Thanh toan don " + order.getOrderCode())
                    .returnUrl("http://localhost:3000/success")
                    .cancelUrl("http://localhost:3000/cancel")
                    .item(item)
                    .build();

            CheckoutResponseData data = payOS.createPaymentLink(paymentData);
            return data.getCheckoutUrl();
        } catch (Exception e) {
            throw new RuntimeException("Error creating payment link: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void handleWebhook(ObjectNode webhookBody) {
        try {
            // Verify webhook data
            WebhookData webhookData = payOS.verifyPaymentWebhookData(webhookBody);

            if (webhookData == null) {
                return;
            }

            // Get order based on payosOrderCode mapped to our internal order ID
            Long orderId = webhookData.getOrderCode();
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found from Webhook"));

            if ("00".equals(webhookData.getCode()) || "success".equalsIgnoreCase(webhookData.getCode())) {
                order.setStatus(OrderStatus.CONFIRMED);
            } else {
                order.setStatus(OrderStatus.CANCELLED);
            }
            orderRepository.save(order);

        } catch (Exception e) {
            System.err.println("Webhook handle error: " + e.getMessage());
        }
    }
}
INNER_EOF

# -- PaymentController --
cat << 'INNER_EOF' > "$CTRL_DIR/PaymentController.java"
package com.example.demo.controller;

import com.example.demo.service.PaymentService;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import vn.payos.type.WebhookType;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/checkout/{orderId}")
    public Map<String, String> createPaymentLink(@PathVariable Long orderId) {
        String checkoutUrl = paymentService.createPaymentLink(orderId);
        return Map.of("checkoutUrl", checkoutUrl);
    }

    @PostMapping("/webhook")
    public ObjectNode handleWebhook(@RequestBody ObjectNode payload) {
        paymentService.handleWebhook(payload);
        
        // PayOS requires returning the request body with success true
        return payload; 
    }
}
INNER_EOF

