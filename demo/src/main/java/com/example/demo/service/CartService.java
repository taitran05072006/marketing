package com.example.demo.service;

import com.example.demo.dto.request.CartItemRequest;
import com.example.demo.dto.response.CartResponse;

public interface CartService {
    CartResponse getMyCart();
    CartResponse addItemToCart(CartItemRequest request);
    CartResponse updateItemQuantity(Long itemId, Integer quantity);
    CartResponse removeItem(Long itemId);
    void clearCart();
}
