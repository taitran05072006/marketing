package com.example.demo.service.impl;

import com.example.demo.dto.response.ProductResponse;
import com.example.demo.entity.product.Product;
import com.example.demo.entity.product.ProductStatus;
import com.example.demo.entity.product.Wishlist;
import com.example.demo.entity.user.User;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ProductImageRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WishlistRepository;
import com.example.demo.security.SecurityUtils;
import com.example.demo.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductImageRepository productImageRepository;

    @Override
    public List<ProductResponse> getMyWishlist() {
        Long userId = SecurityUtils.getCurrentUserId();
        List<Wishlist> wishlists = wishlistRepository.findByUserId(userId);
        
        return wishlists.stream()
                .map(w -> mapToProductResponse(w.getProduct()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void addToWishlist(Long productId) {
        Long userId = SecurityUtils.getCurrentUserId();
        if (wishlistRepository.findByUserIdAndProductId(userId, productId).isPresent()) {
            return; // Already in wishlist
        }

        User user = userRepository.findById(userId).orElseThrow();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
                
        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new BadRequestException("Product is not active");
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);
        wishlistRepository.save(wishlist);
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long productId) {
        Long userId = SecurityUtils.getCurrentUserId();
        wishlistRepository.findByUserIdAndProductId(userId, productId)
                .ifPresent(wishlistRepository::delete);
    }

    @Override
    public boolean checkInWishlist(Long productId) {
        Long userId = SecurityUtils.getCurrentUserId();
        return wishlistRepository.findByUserIdAndProductId(userId, productId).isPresent();
    }
    
    private ProductResponse mapToProductResponse(Product product) {
        ProductResponse res = new ProductResponse();
        res.setId(product.getId());
        res.setName(product.getName());
        res.setSlug(product.getSlug());
        res.setPrice(product.getPrice());
        res.setCategoryName(product.getCategory().getName());
        res.setStatus(product.getStatus().name());
        res.setIsFeatured(product.getIsFeatured());
        res.setCreatedAt(product.getCreatedAt());
        res.setUpdatedAt(product.getUpdatedAt());
        
        productImageRepository.findFirstByProductIdAndIsPrimaryTrue(product.getId())
                .ifPresent(pi -> res.setPrimaryImageUrl(pi.getImageUrl()));
                
        return res;
    }
}
