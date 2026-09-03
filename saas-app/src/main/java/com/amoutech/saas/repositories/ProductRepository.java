package com.amoutech.saas.repositories;

import com.amoutech.saas.entities.Category;
import com.amoutech.saas.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, String> {
    Optional<Product> findByReferenceIgnoreCase(String reference);
}
