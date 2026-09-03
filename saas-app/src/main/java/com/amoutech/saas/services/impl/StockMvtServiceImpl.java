package com.amoutech.saas.services.impl;

import com.amoutech.saas.common.PageResponse;
import com.amoutech.saas.entities.Product;
import com.amoutech.saas.entities.StockMvt;
import com.amoutech.saas.mappers.StockMvtMapper;
import com.amoutech.saas.repositories.ProductRepository;
import com.amoutech.saas.repositories.StockMvtRepository;
import com.amoutech.saas.requests.StockMvtRequest;
import com.amoutech.saas.responses.StockMvtResponse;
import com.amoutech.saas.services.StockMvtService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockMvtServiceImpl implements StockMvtService {

    private final StockMvtRepository stockMvtRepository;
    private final ProductRepository productRepository;
    private final StockMvtMapper stockMvtMapper;

    @Override
    public void create(StockMvtRequest request) {
        // check if product exists
        checkIfProductExistsById(request.getProductId());

        final StockMvt entity = stockMvtMapper.toEntity(request);
        entity.setDateMvt(LocalDate.now());
        stockMvtRepository.save(entity);
    }

    @Override
    public void update(String id, StockMvtRequest request) {
        final Optional<StockMvt> stockMvt = stockMvtRepository.findById(id);
        if (stockMvt.isEmpty()) {
            log.warn("StockMvt does not exist");
            throw new EntityNotFoundException("StockMvt does not exist");
        }

        // check if product exists
        checkIfProductExistsById(request.getProductId());

        final StockMvt stockMvtToUpdate = stockMvtMapper.toEntity(request);
        stockMvtToUpdate.setDateMvt(LocalDate.now());
        stockMvtToUpdate.setId(id);
        stockMvtRepository.save(stockMvtToUpdate);

    }

    @Override
    public PageResponse<StockMvtResponse> findAll(int page, int size) {
        final PageRequest pageRequest = PageRequest.of(page, size);
        final Page<StockMvt> stockMvts = stockMvtRepository.findAll(pageRequest);
        final Page<StockMvtResponse> stockMvtResponses = stockMvts.map(stockMvtMapper::toResponse);
        return PageResponse.of(stockMvtResponses);
    }

    @Override
    public StockMvtResponse findById(String id) {
        return stockMvtRepository.findById(id)
                .map(stockMvtMapper::toResponse)
                .orElseThrow(() -> new EntityNotFoundException("StockMvt does not exist"));
    }

    @Override
    public void delete(String id) {
        final StockMvt stockMvt = stockMvtRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StockMvt does not exist"));
        stockMvtRepository.delete(stockMvt);

    }

    private void checkIfProductExistsById(final String productId) {
        final Optional<Product> product = productRepository.findById(productId);
        if (product.isEmpty()) {
            log.warn("Product does not exist");
            throw new EntityNotFoundException("Product does not exist");
        }
    }

    @Override
    public PageResponse<StockMvtResponse> findAllByProductId(final String productId, final int page, final int size) {
        final PageRequest pageRequest = PageRequest.of(page, size);
        final Page<StockMvt> stockMvts = this.stockMvtRepository.findAllByProductId(productId, pageRequest);
        final Page<StockMvtResponse> stockMvtResponses = stockMvts.map(this.stockMvtMapper::toResponse);
        return PageResponse.of(stockMvtResponses);
    }
}
