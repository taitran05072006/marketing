package com.example.demo.controller;

import com.example.demo.dto.request.ProductCreateRequest;
import com.example.demo.dto.request.ProductUpdateRequest;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.dto.response.ProductDetailResponse;
import com.example.demo.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {
    private final ProductService service;

    @GetMapping
    public PageResponse<ProductDetailResponse> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return service.getAllProducts(page, size);
    }

    @GetMapping("/{id}")
    public ProductDetailResponse getProductById(@PathVariable Long id) {
        return service.getProductById(id);
    }

    @PostMapping
    public ProductDetailResponse createProduct(@Valid @RequestBody ProductCreateRequest request) {
        return service.createProduct(request);
    }

    @PutMapping("/{id}")
    public ProductDetailResponse updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequest request) {
        return service.updateProduct(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        service.deleteProduct(id);
    }
}
