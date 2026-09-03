import { Component } from '@angular/core';
import {TokenService} from '../../../core/token/token-service';
import {RouterOutlet} from '@angular/router';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet, Button],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {

  constructor(private readonly tokenService: TokenService ) {}

  protected async logout() {
    await this.tokenService.logout();
  }

}
