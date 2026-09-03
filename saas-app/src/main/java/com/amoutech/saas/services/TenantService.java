package com.amoutech.saas.services;

import com.amoutech.saas.common.PageResponse;
import com.amoutech.saas.requests.RegisterTenantRequest;
import com.amoutech.saas.responses.TenantResponse;

public interface TenantService {

    void registerTenant(final RegisterTenantRequest request);

    void approveTenant(final String tenantId);

    void activateTenant(final String tenantId);

    void deactivateTenant(final String tenantId);

    void suspendTenant(final String tenantId);

    PageResponse<TenantResponse> findAll(final int page, final int size);
}
