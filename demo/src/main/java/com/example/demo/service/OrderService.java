package com.example.demo.service;

import com.example.demo.dto.request.OrderCreateRequest;
import com.example.demo.dto.response.OrderDetailResponse;
import com.example.demo.dto.response.OrderResponse;
import com.example.demo.dto.response.PageResponse;

public interface OrderService {
    OrderDetailResponse placeOrder(OrderCreateRequest request);
    PageResponse<OrderResponse> getMyOrders(int page, int size);
    OrderDetailResponse getOrderDetails(String orderCode);
    
    // Admin
    PageResponse<OrderDetailResponse> getAllOrders(int page, int size);
    OrderDetailResponse updateOrderStatus(String orderCode, String status);
}
