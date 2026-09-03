package com.amoutech.saas.services;

import com.amoutech.saas.entities.Tenant;

public interface ProvisioningService {

    void provisionTenant(final Tenant tenant);
}
