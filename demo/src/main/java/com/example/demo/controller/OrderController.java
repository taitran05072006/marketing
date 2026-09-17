package com.example.demo.controller;

import com.example.demo.dto.request.OrderCreateRequest;
import com.example.demo.dto.response.OrderDetailResponse;
import com.example.demo.dto.response.OrderResponse;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    @PostMapping
    public OrderDetailResponse placeOrder(@Valid @RequestBody OrderCreateRequest request) {
        return service.placeOrder(request);
    }

    @GetMapping
    public PageResponse<OrderResponse> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return service.getMyOrders(page, size);
    }

    @GetMapping("/{orderCode}")
    public OrderDetailResponse getOrderDetails(@PathVariable String orderCode) {
        return service.getOrderDetails(orderCode);
    }
}
