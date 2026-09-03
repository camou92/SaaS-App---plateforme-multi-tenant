import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import {
  PageResponseProductResponse,
  PageResponseStockMvtResponse,
  ProductResponse, StockMvtRequest,
  StockMvtResponse
} from '../../../api-services/models';
import {ProductService, StockMvtService} from '../../../api-services/services';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import {Dialog} from 'primeng/dialog';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {FormsModule} from '@angular/forms';
import {Tooltip} from 'primeng/tooltip';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-stock-mvt',
  imports: [Button, TableModule, Toast, Dialog, InputText, Select, FormsModule, Tooltip, DatePipe],
  templateUrl: './stock-mvt.html',
  styleUrl: './stock-mvt.scss',
  providers: [MessageService]
})
export class StockMvt implements OnInit {

  protected products: ProductResponse[] = [];
  protected stockMvts: StockMvtResponse[] = [];
  private productPage: PageResponseProductResponse = {};
  private stockMvtsPage: PageResponseStockMvtResponse = {};
  protected selectedProduct: ProductResponse | null = null;
  protected visible: boolean = false;
  protected stockMvtRequest: StockMvtRequest = { dateMvt: '', productId: '', typeMvt: 'IN' };
  protected typeMvt: string[] = ['IN', 'OUT'];
  protected selectedTypeMvt: string = 'IN';
  private stockMvtId: string | null = null;

  constructor(
    private readonly productService: ProductService,
    private readonly stockMvtService: StockMvtService,
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

  protected loadStockMvtsByProductId(product: ProductResponse) {
    this.selectedProduct = product;
    if (this.selectedProduct) {
      this.stockMvtService
        .findAllStockMvtsByProductId({
          'product-id': product.id as string,
          page: 0,
          size: 10,
        })
        .subscribe({
          next: (res) => {
            this.stockMvtsPage = res;
            this.stockMvts = [...(res.content || [])];
            this.cd.detectChanges();
          },
          error: (e) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to load stock movements for the selected product.',
            });
          },
        });
    }
  }

  protected addStockMvt() {
    this.visible = true;
  }

  protected saveStockMvt() {
    if (this.stockMvtId) {
      this.updateStockMvt();
    } else {
      this.createStockMvt();
    }
  }

  private updateStockMvt() {
    // @ts-ignore
    this.stockMvtRequest.typeMvt = this.selectedTypeMvt;
    this.stockMvtRequest.productId = this.selectedProduct?.id as string;
    this.stockMvtService
      .updateStockMvt({
        'stock-mvt-id': this.stockMvtId as string,
        body: this.stockMvtRequest,
      })
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
          });
          this.visible = false;
          this.loadStockMvtsByProductId(this.selectedProduct as ProductResponse);
          this.stockMvtRequest = { dateMvt: '', productId: '', typeMvt: 'IN' };
        },
      });
  }

  private createStockMvt() {
    // @ts-ignore
    this.stockMvtRequest.typeMvt = this.selectedTypeMvt;
    this.stockMvtRequest.productId = this.selectedProduct?.id as string;
    this.stockMvtService
      .createStockMvt({
        body: this.stockMvtRequest,
      })
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Stock movement created successfully.',
          });
          this.visible = false;
          this.loadStockMvtsByProductId(this.selectedProduct as ProductResponse);
          this.stockMvtRequest = { dateMvt: '', productId: '', typeMvt: 'IN' };
        },
      });
  }

  protected modifyStockMvt(stockMvt: StockMvtResponse) {
    this.stockMvtRequest = {
      dateMvt: '',
      productId: this.selectedProduct?.id as string,
      typeMvt: stockMvt.typeMvt as 'IN' | 'OUT',
      comment: stockMvt.comment,
      quantity: stockMvt.quantity,
    };
    this.stockMvtId = stockMvt.id as string;
    this.visible = true;
  }
}
