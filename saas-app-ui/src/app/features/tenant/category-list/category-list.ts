import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Toast } from "primeng/toast";
import { CategoryResponse, PageResponseCategoryResponse } from '../../../api-services/models';
import { CategoryService } from '../../../api-services/services';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { Button } from "primeng/button";

@Component({
  selector: 'app-category-list',
  imports: [Toast, TableModule, Button],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
  providers: [MessageService]
})
export class CategoryList implements OnInit{

  protected categories: CategoryResponse[] = [];
  private categoryPage: PageResponseCategoryResponse = {};

  constructor(
    private readonly categoryService: CategoryService,
    private readonly cd: ChangeDetectorRef,
    private readonly messageService: MessageService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories() {
    this.categoryService
      .findAllCategories({
        page: 0,
        size: 10,
      })
      .subscribe({
        next: (res) => {
          this.categoryPage = res;
          this.categories = [...(res.content || [])];
          this.cd.detectChanges();
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load categories.',
          });
        },
      });
  }

  protected updateCategory(id: string) {
    this.router.navigate(['app', 'manage-category', id]);
  }

  protected deleteCategory(id: string) {}

  protected addCategory() {
    this.router.navigate(['app', 'manage-category']);
  }
}

