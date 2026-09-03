import { Component } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { PasswordDirective } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../../../api-services/models';
import { AuthenticationService } from '../../../api-services/services';
import { ValidationError } from '../../../shared/models/validation-error';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ErrorResponse } from '../../../shared/models/error-response';
import { TokenService } from '../../../core/token/token-service';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FloatLabel, Button, InputText, FormsModule, Toast, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  providers: [MessageService],
})
export class Login {
  loginRequest: LoginRequest = { username: '', password: '' };

  private validationErrors: Array<ValidationError> = [];

  constructor(
    private readonly authService: AuthenticationService,
    private readonly tokenService: TokenService,
    private readonly messageService: MessageService,
    private readonly router: Router,
  ) {}

  protected login() {
    this.authService
      .login({
        body: this.loginRequest,
      })
      .subscribe({
        next: (res) => {
          this.tokenService.saveToken(res);
          this.navigateUser();
        },
        error: (e) => {
          const error = e.error as ErrorResponse;
          this.validationErrors = error.validationErrors || [];

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Login and / or password are incorrect.',
          });
        },
      });
  }
  protected navigateToRegister() {
    this.router.navigate(['register']);
  }

  protected hasError(username: string): boolean {
    return this.validationErrors.some((e) => e.field === username);
  }

  protected getErrorMsg(username: string): string {
    return this.validationErrors.find((e) => e.field === username)?.message || '';
  }

  private navigateUser() {
    if (this.tokenService.isPlatformAdmin) {
      this.router.navigate(['administration']);
    } else if (
      this.tokenService.isCompanyAdmin ||
      this.tokenService.isAdministrator ||
      this.tokenService.isSalesOperator ||
      this.tokenService.isUser
    ) {
      this.router.navigate(['app']);
    }
  }
}
