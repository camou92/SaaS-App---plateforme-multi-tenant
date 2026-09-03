package com.amoutech.saas.services;

import com.amoutech.saas.common.PageResponse;
import com.amoutech.saas.requests.StockMvtRequest;
import com.amoutech.saas.responses.StockMvtResponse;

public interface StockMvtService extends BasicService<StockMvtRequest, StockMvtResponse> {

    PageResponse<StockMvtResponse> findAllByProductId(final String productId, final int page, final int size);
}
