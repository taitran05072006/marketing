package com.example.demo.controller;

import com.example.demo.dto.request.CartItemRequest;
import com.example.demo.dto.response.CartResponse;
import com.example.demo.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService service;

    @GetMapping
    public CartResponse getMyCart() {
        return service.getMyCart();
    }

    @PostMapping("/items")
    public CartResponse addItemToCart(@Valid @RequestBody CartItemRequest request) {
        return service.addItemToCart(request);
    }

    @PutMapping("/items/{itemId}")
    public CartResponse updateItemQuantity(@PathVariable Long itemId, @RequestParam Integer quantity) {
        return service.updateItemQuantity(itemId, quantity);
    }

    @DeleteMapping("/items/{itemId}")
    public CartResponse removeItem(@PathVariable Long itemId) {
        return service.removeItem(itemId);
    }

    @DeleteMapping
    public void clearCart() {
        service.clearCart();
    }
}
