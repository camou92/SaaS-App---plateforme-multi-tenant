import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ValidationError} from '../../../../shared/models/validation-error';
import {UserService} from '../../../../api-services/services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/api';
import {UserRequest} from '../../../../api-services/models/user-request';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';

@Component({
  selector: 'app-manage-user',
  imports: [Button, FloatLabel, FormsModule , InputText, Select],
  templateUrl: './manage-user.html',
  styleUrl: './manage-user.scss',
})
export class ManageUser implements OnInit{

  protected userRequest: UserRequest = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'ROLE_USER',
    username: '',
  };
  private validationErrors: Array<ValidationError> = [];
  protected userId: string | null = null;
  protected roles: string[] = [
    'ROLE_COMPANY_ADMIN',
    'ROLE_ADMINISTRATOR',
    'ROLE_USER',
    'ROLE_SALES_OPERATOR',
  ];
  protected selectedRole: 'ROLE_PLATFORM_ADMIN' | 'ROLE_COMPANY_ADMIN' | 'ROLE_ADMINISTRATOR' | 'ROLE_USER' | 'ROLE_SALES_OPERATOR'  = 'ROLE_USER';

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly cd: ChangeDetectorRef,
  ) {}


  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.paramMap.get('userId');
    if (this.userId) {
      this.loadUserById();
    }
  }

  protected hasError(username: string): boolean {
    return this.validationErrors.some((e) => e.field === username);
  }

  protected getErrorMsg(username: string): string {
    return this.validationErrors.find((e) => e.field === username)?.message || '';
  }

  protected saveUser() {
    this.userRequest.role = this.selectedRole;
    if (this.userId) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  private createUser() {
    this.userService
      .createUser({
        body: this.userRequest,
      })
      .subscribe({
        next: () => {
          this.backToUserList();
        },
        error: (e) => {
          const error = JSON.parse(e.error as string) as { validationErrors: ValidationError[] };
          this.validationErrors = error.validationErrors || [];
        },
      });
  }

  private updateUser() {
    this.userService
      .updateUser({
        'user-id': this.userId as string,
        body: this.userRequest,
      })
      .subscribe({
        next: () => {
          this.backToUserList();
        },
        error: (e) => {
          const error = JSON.parse(e.error as string) as { validationErrors: ValidationError[] };
          this.validationErrors = error.validationErrors || [];
        },
      });
  }

  protected backToUserList() {
    this.router.navigate(['app', 'users-list']);
  }

  private loadUserById() {
    this.userService.getUserById({
      'user-id': this.userId as string
    }).subscribe({
      next: (res) => {
        this.userRequest = {
          firstName: res.firstName || '',
          lastName: res.lastName!,
          role: res.role!,
          email: res.email!,
          username: res.username!,
          password: '',
        };
        this.cd.detectChanges();

      }
    })
  }
}

