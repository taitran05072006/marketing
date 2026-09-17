package com.example.demo.service.impl;

import com.example.demo.dto.request.ProductCreateRequest;
import com.example.demo.dto.request.ProductUpdateRequest;
import com.example.demo.dto.response.PageResponse;
import com.example.demo.dto.response.ProductDetailResponse;
import com.example.demo.dto.response.ProductResponse;
import com.example.demo.entity.product.Product;
import com.example.demo.entity.product.ProductCategory;
import com.example.demo.entity.product.ProductImage;
import com.example.demo.entity.product.ProductStatus;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ProductCategoryRepository;
import com.example.demo.repository.ProductImageRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;

    @Override
    public PageResponse<ProductResponse> getPublishedProducts(int page, int size, String keyword, String categorySlug) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(size, 100));
        Page<Product> productPage;
        if (keyword != null && !keyword.isEmpty()) {
            productPage = productRepository.findByNameContainingIgnoreCase(keyword, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }
        
        List<ProductResponse> content = productPage.getContent().stream()
                .filter(p -> p.getStatus() == ProductStatus.ACTIVE)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
                
        return new PageResponse<>(content, productPage.getNumber(), productPage.getSize(), 
                productPage.getTotalElements(), productPage.getTotalPages());
    }

    @Override
    public ProductDetailResponse getPublishedProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new ResourceNotFoundException("Product not found with slug: " + slug);
        }
        return mapToDetailResponse(product);
    }

    @Override
    public PageResponse<ProductResponse> getProductsByCategorySlug(String slug, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(size, 100));
        Page<Product> productPage = productRepository.findByCategorySlug(slug, pageable);
        
        List<ProductResponse> content = productPage.getContent().stream()
                .filter(p -> p.getStatus() == ProductStatus.ACTIVE && p.getCategory().getSlug().equals(slug))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
                
        return new PageResponse<>(content, productPage.getNumber(), productPage.getSize(), 
                productPage.getTotalElements(), productPage.getTotalPages());
    }

    @Override
    public PageResponse<ProductDetailResponse> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(size, 100));
        Page<Product> productPage = productRepository.findAll(pageable);
        List<ProductDetailResponse> content = productPage.getContent().stream()
                .map(this::mapToDetailResponse)
                .collect(Collectors.toList());
        return new PageResponse<>(content, productPage.getNumber(), productPage.getSize(), 
                productPage.getTotalElements(), productPage.getTotalPages());
    }

    @Override
    public ProductDetailResponse getProductById(Long id) {
        return mapToDetailResponse(getEntityById(id));
    }

    @Override
    @Transactional
    public ProductDetailResponse createProduct(ProductCreateRequest request) {
        if (productRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new DuplicateResourceException("Slug already exists");
        }
        
        ProductCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Product product = new Product();
        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(category);
        
        if (request.getStatus() != null) {
            product.setStatus(ProductStatus.valueOf(request.getStatus()));
        }
        if (request.getIsFeatured() != null) {
            product.setIsFeatured(request.getIsFeatured());
        }
        
        Product savedProduct = productRepository.save(product);
        
        handleProductImages(savedProduct, request.getImageUrls());
        
        return mapToDetailResponse(savedProduct);
    }

    @Override
    @Transactional
    public ProductDetailResponse updateProduct(Long id, ProductUpdateRequest request) {
        Product product = getEntityById(id);
        
        if (!product.getSlug().equals(request.getSlug()) && productRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new DuplicateResourceException("Slug already exists");
        }
        
        ProductCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        product.setName(request.getName());
        product.setSlug(request.getSlug());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(category);
        
        if (request.getStatus() != null) {
            product.setStatus(ProductStatus.valueOf(request.getStatus()));
        }
        if (request.getIsFeatured() != null) {
            product.setIsFeatured(request.getIsFeatured());
        }
        
        Product savedProduct = productRepository.save(product);
        
        handleProductImages(savedProduct, request.getImageUrls());
        
        return mapToDetailResponse(savedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = getEntityById(id);
        productImageRepository.deleteByProductId(id);
        productRepository.delete(product);
    }
    
    private void handleProductImages(Product product, List<String> imageUrls) {
        if (imageUrls == null) return;
        
        productImageRepository.deleteByProductId(product.getId());
        
        for (int i = 0; i < imageUrls.size(); i++) {
            ProductImage pi = new ProductImage();
            pi.setProduct(product);
            pi.setImageUrl(imageUrls.get(i));
            pi.setSortOrder(i);
            pi.setIsPrimary(i == 0);
            productImageRepository.save(pi);
        }
    }
    
    private Product getEntityById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    private ProductResponse mapToResponse(Product product) {
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

    private ProductDetailResponse mapToDetailResponse(Product product) {
        ProductDetailResponse res = new ProductDetailResponse();
        res.setId(product.getId());
        res.setName(product.getName());
        res.setSlug(product.getSlug());
        res.setDescription(product.getDescription());
        res.setPrice(product.getPrice());
        res.setStock(product.getStock());
        res.setCategoryName(product.getCategory().getName());
        res.setStatus(product.getStatus().name());
        res.setIsFeatured(product.getIsFeatured());
        res.setCreatedAt(product.getCreatedAt());
        res.setUpdatedAt(product.getUpdatedAt());
        
        List<String> images = productImageRepository.findByProductIdOrderBySortOrderAsc(product.getId())
                .stream().map(ProductImage::getImageUrl).collect(Collectors.toList());
        res.setImageUrls(images);
                
        return res;
    }
}
