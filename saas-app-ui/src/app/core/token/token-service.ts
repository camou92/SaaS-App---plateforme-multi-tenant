import { Injectable } from '@angular/core';
import { LoginResponse } from '../../api-services/models';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private readonly router: Router) { }

  saveToken(loginResponse: LoginResponse) {
    localStorage.setItem('token', loginResponse.accessToken!);
  }

  token() {
    return localStorage.getItem('token');
  }

  get userRole(): string {
    const token = this.token();
    if (token) {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
      return decodedToken['role'];
    }
    return '';
  }

  get userId() :string {
    const token = this.token();
    if (token) {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
      return decodedToken['sub'];
    }
    return '';
  }

  get isPlatformAdmin() : boolean {
    return this.userRole === 'ROLE_PLATFORM_ADMIN';
  }

  get isCompanyAdmin() : boolean {
    return this.userRole === 'ROLE_COMPANY_ADMIN';
  }

  get isAdministrator() : boolean {
    return this.userRole === 'ROLE_ADMINISTRATOR';
  }

  get isUser() : boolean {
    return this.userRole === 'ROLE_USER';
  }

  get isSalesOperator() : boolean {
    return this.userRole === 'ROLE_SALES_OPERATOR';
  }

  get isTenantUser(): boolean {
    return this.isCompanyAdmin || this.isAdministrator || this.isUser || this.isSalesOperator;
  }

  get isTokenValid() : boolean {
    const token = this.token();
    if (token) {
      const jwtHelper = new JwtHelperService();
      const isExpired = jwtHelper.isTokenExpired(token);
      if (isExpired) {
        this.logout();
        return false;
      }
      return true;
    }
    return false;
  }

  async logout() {
    await this.router.navigate(['login']);
    localStorage.clear();
  }

  clearToken() {
    localStorage.removeItem('token');
  }
}