package com.example.demo.controller;

import com.example.demo.dto.response.ProductResponse;
import com.example.demo.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlists")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService service;

    @GetMapping
    public List<ProductResponse> getMyWishlist() {
        return service.getMyWishlist();
    }

    @PostMapping("/{productId}")
    public void addToWishlist(@PathVariable Long productId) {
        service.addToWishlist(productId);
    }

    @DeleteMapping("/{productId}")
    public void removeFromWishlist(@PathVariable Long productId) {
        service.removeFromWishlist(productId);
    }

    @GetMapping("/{productId}/check")
    public Map<String, Boolean> checkInWishlist(@PathVariable Long productId) {
        return Map.of("inWishlist", service.checkInWishlist(productId));
    }
}
