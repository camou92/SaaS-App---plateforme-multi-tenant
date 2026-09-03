import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PageResponseTenantResponse, TenantResponse } from '../../../api-services/models';
import { TenantService } from '../../../api-services/services';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-tenant-list',
  imports: [TableModule, Toast, Tooltip],
  templateUrl: './tenant-list.html',
  styleUrl: './tenant-list.scss',
  providers: [MessageService],
})
export class TenantList implements OnInit{

  protected tenants: TenantResponse[] = [];
  private tenantPage: PageResponseTenantResponse = {};

  constructor(
    private readonly tenantService: TenantService,
    private readonly messageService: MessageService,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTenants();
  }

  private loadTenants() {
    this.tenantService
      .findAllTenants({
        page: 0,
        size: 10,
      })
      .subscribe({
        next: (res) => {
          this.tenantPage = res;
          this.tenants = [...res.content || []];
          this.cd.detectChanges();
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load tenants.',
          });
        },
      });
  }

  protected approveTenant(tenantId: string) {
    this.tenantService.approveTenant({
      'tenant-id': tenantId,
    }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tenant approved successfully.',
        });
        this.loadTenants();
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to approve tenant.',
        })
      }
    })
  }

  protected deactivateTenant(tenantId: string) {
    this.tenantService.deactivateTenant({
      'tenant-id': tenantId,
    }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tenant deactivated successfully.',
        });
        this.loadTenants();
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to deactivate tenant.',
        })
      }
    })
  }

  protected suspendTenant(tenantId: string) {
    this.tenantService.suspendTenant({
      'tenant-id': tenantId,
    }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tenant suspended successfully.',
        });
        this.loadTenants();
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to suspend tenant.',
        })
      }
    })
  }

  protected activateTenant(tenantId: string) {
    this.tenantService.activateTenant({
      'tenant-id': tenantId,
    }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tenant activated successfully.',
        });
        this.loadTenants();
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to activate tenant.',
        })
      }
    })
  }
}
