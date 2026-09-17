package com.example.demo.controller;

import com.example.demo.dto.response.OrderDetailResponse;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService service;

    @GetMapping
    public PageResponse<OrderDetailResponse> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return service.getAllOrders(page, size);
    }

    @PutMapping("/{orderCode}/status")
    public OrderDetailResponse updateOrderStatus(
            @PathVariable String orderCode,
            @RequestParam String status) {
        return service.updateOrderStatus(orderCode, status);
    }
}
