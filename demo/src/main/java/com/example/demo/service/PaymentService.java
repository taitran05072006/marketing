package com.example.demo.service;

public interface PaymentService {
    String createPaymentLink(Long orderId);
    String createCodPayment(Long orderId);
    void handleWebhook(Object webhookBody);
}
