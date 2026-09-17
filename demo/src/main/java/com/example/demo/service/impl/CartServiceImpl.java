package com.example.demo.service.impl;

import com.example.demo.dto.request.CartItemRequest;
import com.example.demo.dto.response.CartItemResponse;
import com.example.demo.dto.response.CartResponse;
import com.example.demo.entity.cart.Cart;
import com.example.demo.entity.cart.CartItem;
import com.example.demo.entity.product.Product;
import com.example.demo.entity.user.User;
import com.example.demo.exception.BadRequestException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.ProductImageRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.SecurityUtils;
import com.example.demo.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductImageRepository productImageRepository;

    private Cart getOrCreateCart() {
        Long userId = SecurityUtils.getCurrentUserId();
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId).orElseThrow();
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    @Override
    public CartResponse getMyCart() {
        Cart cart = getOrCreateCart();
        return mapToResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addItemToCart(CartItemRequest request) {
        Cart cart = getOrCreateCart();
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStatus() != com.example.demo.entity.product.ProductStatus.ACTIVE) {
            throw new BadRequestException("Product is not active");
        }
        if (request.getQuantity() <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }
        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("Not enough stock");
        }

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(new CartItem());

        if (item.getId() == null) {
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(request.getQuantity());
        } else {
            int newQuantity = item.getQuantity() + request.getQuantity();
            if (product.getStock() < newQuantity) {
                throw new BadRequestException("Not enough stock");
            }
            item.setQuantity(newQuantity);
        }

        cartItemRepository.save(item);
        return mapToResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateItemQuantity(Long itemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
                
        Cart cart = getOrCreateCart();
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to your cart");
        }

        if (quantity <= 0) {
            throw new BadRequestException("Quantity must be greater than 0");
        }
        if (item.getProduct().getStock() < quantity) {
            throw new BadRequestException("Not enough stock");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return mapToResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeItem(Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
                
        Cart cart = getOrCreateCart();
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to your cart");
        }

        cartItemRepository.delete(item);
        return mapToResponse(cart);
    }

    @Override
    @Transactional
    public void clearCart() {
        Cart cart = getOrCreateCart();
        cartItemRepository.deleteByCartId(cart.getId());
    }

    private CartResponse mapToResponse(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        List<CartItemResponse> itemResponses = items.stream().map(item -> {
            CartItemResponse res = new CartItemResponse();
            res.setId(item.getId());
            res.setProductId(item.getProduct().getId());
            res.setProductName(item.getProduct().getName());
            res.setPrice(item.getProduct().getPrice());
            res.setQuantity(item.getQuantity());
            
            productImageRepository.findFirstByProductIdAndIsPrimaryTrue(item.getProduct().getId())
                .ifPresent(img -> res.setPrimaryImageUrl(img.getImageUrl()));
                
            return res;
        }).collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(i -> i.getProduct().getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setItems(itemResponses);
        response.setTotalAmount(total);
        return response;
    }
}
