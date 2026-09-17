package com.example.demo.service.impl;

import com.example.demo.entity.order.Order;
import com.example.demo.entity.order.OrderStatus;
import com.example.demo.entity.payment.Payment;
import com.example.demo.entity.payment.PaymentProvider;
import com.example.demo.entity.payment.PaymentStatus;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.v2.paymentRequests.PaymentLinkItem;
import vn.payos.model.webhooks.WebhookData;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final PayOS payOS;

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    @Transactional
    public String createPaymentLink(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        try {
            // Generate a unique order code for PayOS to prevent duplicate errors (max 53 bits)
            // Combine timestamp (10 digits) + orderId to ensure uniqueness
            Long payosOrderCode = Long.parseLong(String.valueOf(System.currentTimeMillis() / 1000) + orderId);

            PaymentLinkItem item = PaymentLinkItem.builder()
                    .name("Order " + order.getOrderCode())
                    .quantity(1)
                    .price(order.getTotalAmount().longValue())
                    .build();

            CreatePaymentLinkRequest request = CreatePaymentLinkRequest.builder()
                    .orderCode(payosOrderCode)
                    .amount(order.getTotalAmount().longValue())
                    .description("Thanh toan don " + order.getOrderCode())
                    .returnUrl(frontendUrl + "/orders/" + order.getOrderCode() + "?status=success")
                    .cancelUrl(frontendUrl + "/orders/" + order.getOrderCode() + "?status=cancel")
                    .item(item)
                    .build();

            CreatePaymentLinkResponse data = payOS.paymentRequests().create(request);

            // Create or update Payment entity
            Payment payment = paymentRepository.findByOrderId(orderId).orElse(new Payment());
            payment.setOrder(order);
            payment.setProvider(PaymentProvider.PAYOS);
            payment.setPaymentCode(String.valueOf(payosOrderCode));
            payment.setAmount(order.getTotalAmount());
            payment.setStatus(PaymentStatus.PENDING);
            payment.setPaymentUrl(data.getCheckoutUrl());
            paymentRepository.save(payment);

            return data.getCheckoutUrl();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error creating payment link: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public String createCodPayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        Payment payment = paymentRepository.findByOrderId(orderId).orElse(new Payment());
        payment.setOrder(order);
        payment.setProvider(PaymentProvider.COD);
        payment.setPaymentCode("COD-" + order.getOrderCode());
        payment.setAmount(order.getTotalAmount());
        payment.setStatus(PaymentStatus.PENDING);
        // Direct back to success page
        payment.setPaymentUrl(frontendUrl + "/orders/" + order.getOrderCode() + "?status=success");
        paymentRepository.save(payment);

        return payment.getPaymentUrl();
    }

    @Override
    @Transactional
    public void handleWebhook(Object webhookBody) {
        try {
            // Verify webhook data using WebhooksService
            WebhookData webhookData = payOS.webhooks().verify(webhookBody);

            if (webhookData == null) {
                return;
            }

            Long payosOrderCode = webhookData.getOrderCode();
            Payment payment = paymentRepository.findByPaymentCode(String.valueOf(payosOrderCode))
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found for orderCode: " + payosOrderCode));
                    
            Order order = payment.getOrder();

            if ("00".equals(webhookData.getCode()) || "success".equalsIgnoreCase(webhookData.getCode())) {
                order.setStatus(OrderStatus.CONFIRMED);
                if (payment != null) {
                    payment.setStatus(PaymentStatus.PAID);
                    payment.setTransactionId("PAYOS-" + webhookData.getOrderCode());
                    payment.setPaidAt(LocalDateTime.now());
                }
            } else {
                order.setStatus(OrderStatus.CANCELLED);
                if (payment != null) {
                    payment.setStatus(PaymentStatus.FAILED);
                }
            }
            orderRepository.save(order);
            if (payment != null) {
                paymentRepository.save(payment);
            }

        } catch (Exception e) {
            System.err.println("Webhook handle error: " + e.getMessage());
        }
    }
}
