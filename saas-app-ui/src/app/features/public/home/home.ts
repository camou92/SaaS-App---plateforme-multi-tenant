import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-home',
  imports: [Button],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login'])
  }

  navigateToRegister() {
    this.router.navigate(['/register'])
  }
}
