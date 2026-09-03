import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Button } from "primeng/button";
import {TokenService} from '../../../core/token/token-service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Button],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  constructor(
    private readonly router: Router,
    private readonly tokenService: TokenService
    ,
  ) {}

  protected navigateTo(c: string) {
    if (c === 'p') {
      this.router.navigate(['app', 'products']);
    } else if (c === 'c') {
      this.router.navigate(['app', 'categories']);
    } else if (c === 's') {
      this.router.navigate(['app', 'stock-mvts']);
    } else if (c === 'u') {
      this.router.navigate(['app', 'users-list']);
    }else if (c === 'd') { // Dashboard
      this.router.navigate(['app']);
    }
  }

  protected async logout() {
    await this.tokenService.logout();
  }
}
