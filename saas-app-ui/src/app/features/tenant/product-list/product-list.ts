import { ChangeDetectorRef, Component } from '@angular/core';
import { Toast } from "primeng/toast";
import { Button } from "primeng/button";
import { TableModule } from "primeng/table";
import { PageResponseProductResponse, ProductResponse } from '../../../api-services/models';
import { ProductService } from '../../../api-services/services';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import {CurrencyPipe} from '@angular/common';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-product-list',
  imports: [Button, TableModule, Toast, Tooltip, CurrencyPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  providers: [MessageService]
})
export class ProductList {

  protected products: ProductResponse[] = [];
  private productPage: PageResponseProductResponse = {};

  constructor(
    private readonly productService: ProductService,
    private readonly cd: ChangeDetectorRef,
    private readonly messageService: MessageService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts() {
    this.productService
      .findAllProducts({
        page: 0,
        size: 10,
      })
      .subscribe({
        next: (res) => {
          this.productPage = res;
          this.products = [...(res.content || [])];
          this.cd.detectChanges();
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load products.',
          });
        },
      });
  }

  protected updateProduct(id: string) {
    this.router.navigate(['app', 'manage-product', id]);
  }

  protected deleteProduct(id: string) {}

  protected addProduct() {
    this.router.navigate(['app', 'manage-product']);
  }
}
