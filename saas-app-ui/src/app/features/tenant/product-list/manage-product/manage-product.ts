import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Toast } from "primeng/toast";
import { FloatLabel } from "primeng/floatlabel";
import {Select, SelectModule} from "primeng/select";
import { lastValueFrom } from 'rxjs';
import { CategoryResponse, ProductRequest } from '../../../../api-services/models';
import { ValidationError } from '../../../../shared/models/validation-error';
import { CategoryService, ProductService } from '../../../../api-services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Button } from "primeng/button";
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-manage-product',
  imports: [Button, FloatLabel, InputText, ReactiveFormsModule, FormsModule, Select],
  templateUrl: './manage-product.html',
  styleUrl: './manage-product.scss',
  providers: [MessageService]
})
export class ManageProduct implements OnInit{

  protected productRequest: ProductRequest = { categoryId: '', reference: '', name: '' };
  private validationErrors: Array<ValidationError> = [];
  protected productId: string | null = null;
  protected categories: CategoryResponse[] = [];
  protected selectedCategory: CategoryResponse | null = null;

  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly cd: ChangeDetectorRef,
  ) {}

  // @ts-ignore
  async ngOnInit() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId');
    if (this.productId) {
      await this.loadProductById();
      this.loadCategories();
    } else {
      this.loadCategories();
    }
  }

  protected hasError(username: string): boolean {
    return this.validationErrors.some((e) => e.field === username);
  }

  protected getErrorMsg(username: string): string {
    return this.validationErrors.find((e) => e.field === username)?.message || '';
  }

  protected saveProduct() {
    if (this.productId) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  private createProduct() {
    this.productRequest.categoryId = this.selectedCategory?.id || '';
    this.productService
      .createProduct({
        body: this.productRequest,
      })
      .subscribe({
        next: () => {
          this.backToCategories();
        },
        error: (e) => {
          const error = JSON.parse(e.error as string) as { validationErrors: ValidationError[] };
          this.validationErrors = error.validationErrors || [];
        },
      });
  }

  private updateProduct() {
    this.productRequest.categoryId = this.selectedCategory?.id || '';
    this.productService
      .updateProduct({
        'product-id': this.productId as string,
        body: this.productRequest,
      })
      .subscribe({
        next: () => {
          this.backToCategories();
        },
        error: (e) => {
          const error = JSON.parse(e.error as string) as { validationErrors: ValidationError[] };
          this.validationErrors = error.validationErrors || [];
        },
      });
  }

  protected backToCategories() {
    this.router.navigate(['app', 'products']);
  }

  private loadCategories() {
    this.categoryService.findAllCategories({
      page: 0,
    }).subscribe({
      next: (res) => {
        this.categories = res.content || [];
        if (this.productId) {
          const cat = this.categories.find(c => c.id === this.productRequest.categoryId);
          this.selectedCategory = cat!;
        }
        this.cd.detectChanges();
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load categories.',
        });
      }
    })
  }

  private async loadProductById() {

    const res = await lastValueFrom(this.productService.findProductById({ 'product-id': this.productId as string}));
    this.productRequest = {
      name: res.name || '',
      description: res.description,
      categoryId: res.categoryId!,
      reference: res.reference!,
      price: res.price!,
      alertThreshold: res.alertThreshold!,
    };
    this.cd.detectChanges();
  }
}
