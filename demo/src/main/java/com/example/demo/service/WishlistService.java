package com.example.demo.service;

import com.example.demo.dto.response.ProductResponse;
import java.util.List;

public interface WishlistService {
    List<ProductResponse> getMyWishlist();
    void addToWishlist(Long productId);
    void removeFromWishlist(Long productId);
    boolean checkInWishlist(Long productId);
}
