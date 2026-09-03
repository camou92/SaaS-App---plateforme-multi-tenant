package com.amoutech.saas.services.impl;

import com.amoutech.saas.common.PageResponse;
import com.amoutech.saas.entities.Category;
import com.amoutech.saas.exceptions.DuplicateResourceException;
import com.amoutech.saas.mappers.CategoryMapper;
import com.amoutech.saas.repositories.CategoryRepository;
import com.amoutech.saas.requests.CategoryRequest;
import com.amoutech.saas.responses.CategoryResponse;
import com.amoutech.saas.services.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public void create(CategoryRequest request) {
        // check if category already exists
        checkIfCategoryAlreadyExistsByName(request.getName());
        final Category entity = categoryMapper.toEntity(request);
        categoryRepository.save(entity);

    }



    @Override
    public void update(String id, CategoryRequest request) {
        // check if category already exists by ID
        final Optional<Category> existingCategory = categoryRepository.findById(id);
        if (existingCategory.isEmpty()) {
            log.warn("Category does not exist");
            throw new EntityNotFoundException("Category does Not exist");
        }

        // check if category already exists
        if (!existingCategory.get().getName().equalsIgnoreCase(request.getName())) {
            checkIfCategoryAlreadyExistsByName(request.getName());
        }

        final Category categoryToUpdate = categoryMapper.toEntity(request);
        categoryToUpdate.setId(id);
        categoryRepository.save(categoryToUpdate);
    }

    @Override
    public PageResponse<CategoryResponse> findAll(int page, int size) {
        final PageRequest pageRequest = PageRequest.of(page, size);
        final Page<Category> categories = categoryRepository.findAll(pageRequest);
        final Page<CategoryResponse> categoryResponses = categories.map(categoryMapper::toResponse);
        return PageResponse.of(categoryResponses);
    }

    @Override
    public CategoryResponse findById(String id) {
        return categoryRepository.findById(id)
                .map(categoryMapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("Category does not exist"));
    }

    @Override
    public void delete(String id) {
        final Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category does not exist"));
        categoryRepository.delete(category);

    }

    private void checkIfCategoryAlreadyExistsByName(String categoryName) {
        final Optional<Category> category = categoryRepository.findByNameIgnoreCase(categoryName);
        if (category.isPresent()) {
            log.warn("Category '{}' already exists", categoryName);
            throw new DuplicateResourceException("Category already exists");
        }
    }
}
