package com.amoutech.saas.mappers;

import com.amoutech.saas.entities.Category;
import com.amoutech.saas.requests.CategoryRequest;
import com.amoutech.saas.responses.CategoryResponse;
import org.springframework.stereotype.Component;

@Component
public class CategoryMapper {

    public Category toEntity(final CategoryRequest request) {
        return Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .deleted(false)
                .build();
    }

    public CategoryResponse toResponse(final Category entity) {
        final int nbProduct = 0; //entity.getProducts() == null ? 0 : entity.getProducts().size();
        return CategoryResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .nbProducts(nbProduct)
                .build();
    }
}
