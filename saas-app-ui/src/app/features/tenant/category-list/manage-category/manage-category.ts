import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { CategoryRequest } from '../../../../api-services/models';
import { ValidationError } from '../../../../shared/models/validation-error';
import { FormsModule } from '@angular/forms';
import { Button } from "primeng/button";
import { CategoryService } from '../../../../api-services/services';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from "primeng/toast";

@Component({
  selector: 'app-manage-category',
  imports: [FloatLabel, FormsModule, Button, Toast],
  templateUrl: './manage-category.html',
  styleUrl: './manage-category.scss',
  providers: [MessageService]
})
export class ManageCategory implements OnInit{
  protected categoryRequest: CategoryRequest = { name: '' };

  private validationErrors: Array<ValidationError> = [];

   protected categoryId: string | null = null;

  constructor(
    private readonly categoryService: CategoryService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.categoryId = this.activatedRoute.snapshot.paramMap.get('categoryId');
    if (this.categoryId) {
      this.loadCategoryById();
    }
  }

  protected hasError(username: string): boolean {
    return this.validationErrors.some((e) => e.field === username);
  }

  protected getErrorMsg(username: string): string {
    return this.validationErrors.find((e) => e.field === username)?.message || '';
  }

  protected saveCategory() {
    if (this.categoryId) {
       this.updateCategory();
    } else {
      this.createCategory();
    }
  }

  private createCategory() {
    this.categoryService
      .createCategory({
        body: this.categoryRequest,
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

  private updateCategory() {
    this.categoryService.updateCategory({
      'category-id': this.categoryId as string,
      body: this.categoryRequest,
    }).subscribe({
      next: () => {
        this.backToCategories();
      },
      error: (e) => {
        const error = JSON.parse(e.error as string) as { validationErrors: ValidationError[] };
        this.validationErrors = error.validationErrors || [];
      },
    })
  }

  protected backToCategories() {
    this.router.navigate(['app', 'categories']);
  }

  private loadCategoryById() {
    this.categoryService
      .findCategoryById({
        'category-id': this.categoryId as string,
      })
      .subscribe({
        next: (res) => {
          this.categoryRequest = {
            name: res.name || '',
            description: res.description,
          };
          this.cd.detectChanges();
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load category.',
          });
        },
      });
  }

}
