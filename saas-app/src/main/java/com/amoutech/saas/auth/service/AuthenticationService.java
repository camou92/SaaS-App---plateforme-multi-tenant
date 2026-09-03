package com.amoutech.saas.auth.service;

import com.amoutech.saas.auth.requests.LoginRequest;
import com.amoutech.saas.auth.responses.LoginResponse;

public interface AuthenticationService {

    LoginResponse login(final LoginRequest request);
}
