package com.amoutech.saas.services.impl;

import com.amoutech.saas.common.PageResponse;
import com.amoutech.saas.entities.Category;
import com.amoutech.saas.entities.Product;
import com.amoutech.saas.mappers.ProductMapper;
import com.amoutech.saas.repositories.CategoryRepository;
import com.amoutech.saas.repositories.ProductRepository;
import com.amoutech.saas.requests.ProductRequest;
import com.amoutech.saas.responses.ProductResponse;
import com.amoutech.saas.services.ProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Override
    public void create(ProductRequest request) {
        // check if product already exists
        checkIfProductAlreadyExistsByReference(request.getReference());

        // check if category exists
        checkIfCategoryExistById(request.getCategoryId());

        final Product entity = productMapper.toEntity(request);
        productRepository.save(entity);

    }

    @Override
    public void update(String id, ProductRequest request) {
        // check if product exists
        final Optional<Product> productExists = productRepository.findById(id);
        if (productExists.isEmpty()) {
            log.warn("Productss does not exist");
            throw new EntityNotFoundException("Product does not exist");
        }

        // check if product already exists
        if (!productExists.get().getReference().equalsIgnoreCase(request.getReference())) {
            checkIfProductAlreadyExistsByReference(request.getReference());
        }

        // check if category exists
        checkIfCategoryExistById(request.getCategoryId());

        final Product productToUpdate = productMapper.toEntity(request);
        productToUpdate.setId(id);
        productRepository.save(productToUpdate);

    }

    @Override
    public PageResponse<ProductResponse> findAll(int page, int size) {
        final PageRequest pageRequest = PageRequest.of(page, size);
        final Page<Product> products = productRepository.findAll(pageRequest);
        final Page<ProductResponse> productResponses = products.map(productMapper::toResponse);

        return PageResponse.of(productResponses);
    }

    @Override
    public ProductResponse findById(String id) {
        return productRepository.findById(id)
                .map(productMapper::toResponse)
                .orElseThrow(()-> new EntityNotFoundException("Product does not exist"));
    }

    @Override
    public void delete(String id) {
        final Product product = productRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Product does not exist"));
        productRepository.delete(product);
    }

    private void checkIfProductAlreadyExistsByReference(final String reference) {
        final Optional<Product> product = productRepository.findByReferenceIgnoreCase(reference);
        if (product.isPresent()) {
            log.warn("Product already exists");
            throw new RuntimeException("Product already exists");
        }
    }

    private void checkIfCategoryExistById(final String categoryId) {
        final Optional<Category> category = categoryRepository.findById(categoryId);
        if (category.isEmpty()) {
            log.warn("Category does not exist");
            throw new EntityNotFoundException("Category does not exist");
        }
    }

}
