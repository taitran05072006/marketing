package com.example.demo.service.impl;

import com.example.demo.dto.request.ProductCategoryCreateRequest;
import com.example.demo.dto.request.ProductCategoryUpdateRequest;
import com.example.demo.dto.response.ProductCategoryResponse;
import com.example.demo.entity.product.ProductCategory;
import com.example.demo.exception.DuplicateResourceException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ProductCategoryRepository;
import com.example.demo.service.ProductCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductCategoryServiceImpl implements ProductCategoryService {

    private final ProductCategoryRepository repository;

    @Override
    public List<ProductCategoryResponse> getAllCategories() {
        return repository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ProductCategoryResponse getCategoryBySlug(String slug) {
        ProductCategory category = repository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
        return mapToResponse(category);
    }

    @Override
    public ProductCategoryResponse getCategoryById(Long id) {
        ProductCategory category = getEntityById(id);
        return mapToResponse(category);
    }

    @Override
    @Transactional
    public ProductCategoryResponse createCategory(ProductCategoryCreateRequest request) {
        if (repository.findBySlug(request.getSlug()).isPresent()) {
            throw new DuplicateResourceException("Slug already exists");
        }
        ProductCategory category = new ProductCategory();
        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());
        
        return mapToResponse(repository.save(category));
    }

    @Override
    @Transactional
    public ProductCategoryResponse updateCategory(Long id, ProductCategoryUpdateRequest request) {
        ProductCategory category = getEntityById(id);
        if (!category.getSlug().equals(request.getSlug()) && repository.findBySlug(request.getSlug()).isPresent()) {
            throw new DuplicateResourceException("Slug already exists");
        }
        category.setName(request.getName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());
        
        return mapToResponse(repository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        ProductCategory category = getEntityById(id);
        repository.delete(category);
    }

    private ProductCategory getEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    private ProductCategoryResponse mapToResponse(ProductCategory category) {
        ProductCategoryResponse response = new ProductCategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setSlug(category.getSlug());
        response.setDescription(category.getDescription());
        return response;
    }
}
