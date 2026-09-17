package com.example.demo.controller;

import com.example.demo.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/checkout/{orderId}")
    public Map<String, String> createPaymentLink(
            @PathVariable Long orderId, 
            @RequestParam(required = false, defaultValue = "PAYOS") String method) {
            
        if ("COD".equalsIgnoreCase(method)) {
            String redirectUrl = paymentService.createCodPayment(orderId);
            return Map.of("checkoutUrl", redirectUrl);
        }
        
        String checkoutUrl = paymentService.createPaymentLink(orderId);
        return Map.of("checkoutUrl", checkoutUrl);
    }

    @PostMapping("/webhook")
    public Object handleWebhook(@RequestBody Object payload) {
        paymentService.handleWebhook(payload);
        return payload; 
    }
}
