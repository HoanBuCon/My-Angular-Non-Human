import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Application, ApplicationFilter, CreateAppWizardPayload } from '../../models/application.model';
import { ApplicationService } from '../../services/application.service';
import { ToastService } from '../../services/toast.service';
import { AppTableComponent } from './components/app-table/app-table.component';
import { CreateAppWizardComponent } from './components/create-app-wizard/create-app-wizard.component';
import { AppFormModalComponent } from './components/app-form-modal/app-form-modal.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-app-list',
  standalone: true,
  imports: [
    CommonModule,
    AppTableComponent,
    CreateAppWizardComponent,
    AppFormModalComponent,
    PaginationComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.scss']
})
export class AppListComponent implements OnInit, OnDestroy {
  applications: Application[] = [];
  filteredApps: Application[] = [];

  currentPage: number = 1;
  pageSize: number = 10;
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  currentFilter: ApplicationFilter = {
    name: '',
    creator: '',
    createdAt: '',
    category: '',
    status: '',
    channel: '',
    userCount: '',
    scriptCount: ''
  };

  viewMode: 'list' | 'create' = 'list';
  isSidebarCollapsed: boolean = false;

  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  selectedApp: Application | null = null;

  isDeleteModalOpen: boolean = false;
  appToDelete: Application | null = null;

  private sub = new Subscription();

  constructor(
    private appService: ApplicationService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.appService.getApplications().subscribe(apps => {
        this.applications = apps;
        this.applyFiltersAndSort();
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get pagedApps(): Application[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredApps.slice(start, start + this.pageSize);
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  onFilterChange(filter: ApplicationFilter): void {
    this.currentFilter = filter;
    this.currentPage = 1;
    this.applyFiltersAndSort();
  }

  onSortChange(sort: { column: string; direction: 'asc' | 'desc' }): void {
    this.sortColumn = sort.column;
    this.sortDirection = sort.direction;
    this.applyFiltersAndSort();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }

  private applyFiltersAndSort(): void {
    let result = [...this.applications];
    const f = this.currentFilter;

    if (f.name.trim()) {
      const q = f.name.toLowerCase().trim();
      result = result.filter(a => a.name.toLowerCase().includes(q));
    }
    if (f.creator.trim()) {
      const q = f.creator.toLowerCase().trim();
      result = result.filter(a => a.creator.toLowerCase().includes(q));
    }
    if (f.createdAt.trim()) {
      const q = f.createdAt.trim();
      result = result.filter(a => a.createdAt.includes(q));
    }
    if (f.category) {
      result = result.filter(a => a.category === f.category);
    }
    if (f.status) {
      result = result.filter(a => a.status === f.status);
    }
    if (f.channel) {
      result = result.filter(a => a.channels.includes(f.channel as 'facebook' | 'web'));
    }
    if (f.userCount.trim()) {
      result = result.filter(a => String(a.userCount).includes(f.userCount.trim()));
    }
    if (f.scriptCount) {
      result = result.filter(a => a.scriptCount === f.scriptCount);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (this.sortColumn === 'id') {
        comparison = a.id - b.id;
      } else if (this.sortColumn === 'name') {
        comparison = a.name.localeCompare(b.name, 'vi');
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    this.filteredApps = result;
  }

  openCreateWizard(): void {
    this.viewMode = 'create';
  }

  closeCreateWizard(): void {
    this.viewMode = 'list';
  }

  onWizardComplete(payload: CreateAppWizardPayload): void {
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    const newApp: Omit<Application, 'id'> = {
      name: payload.name,
      creator: 'Quản trị viên',
      createdAt: dateStr,
      category: payload.category,
      status: 'Đang sử dụng',
      channels: ['web', 'facebook'],
      userCount: payload.assignedUsers.length > 0 ? payload.assignedUsers.length * 50 : 100,
      scriptCount: '01',
      description: payload.description
    };

    this.appService.addApplication(newApp).subscribe(() => {
      this.toast.success(`Ứng dụng "${payload.name}" đã được tạo thành công!`);
      this.viewMode = 'list';
      this.currentPage = 1;
    });
  }

  openEditModal(app: Application): void {
    this.selectedApp = app;
    this.isEditMode = true;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedApp = null;
  }

  onModalSave(data: any): void {
    if (this.isEditMode && data.id) {
      this.appService.updateApplication(data.id, data).subscribe({
        next: () => {
          this.toast.success('Cập nhật ứng dụng thành công');
          this.closeModal();
        },
        error: () => this.toast.error('Có lỗi xảy ra khi cập nhật')
      });
    } else {
      this.appService.addApplication(data).subscribe({
        next: () => {
          this.toast.success('Thêm ứng dụng thành công');
          this.closeModal();
        },
        error: () => this.toast.error('Có lỗi xảy ra khi thêm')
      });
    }
  }

  toggleStatus(app: Application): void {
    this.appService.toggleStatus(app.id).subscribe({
      next: updated => {
        if (!updated) return;
        const msg = updated.status === 'Đang sử dụng'
          ? `Đã mở khóa ứng dụng "${updated.name}"`
          : `Đã khóa ứng dụng "${updated.name}"`;
        this.toast.info(msg);
      },
      error: () => this.toast.error('Có lỗi khi đổi trạng thái')
    });
  }

  confirmDelete(app: Application): void {
    this.appToDelete = app;
    this.isDeleteModalOpen = true;
  }

  onDeleteConfirmed(): void {
    if (!this.appToDelete) return;
    const name = this.appToDelete.name;
    this.appService.deleteApplication(this.appToDelete.id).subscribe({
      next: () => {
        this.toast.success(`Đã xóa ứng dụng "${name}"`);
        this.isDeleteModalOpen = false;
        this.appToDelete = null;
      },
      error: () => this.toast.error('Có lỗi khi xóa ứng dụng')
    });
  }

  cancelDelete(): void {
    this.isDeleteModalOpen = false;
    this.appToDelete = null;
  }

  exportList(): void {
    const headers = ['STT', 'Tên ứng dụng', 'Người tạo', 'Thời gian tạo', 'Lĩnh vực', 'Trạng thái', 'Kênh tương tác', 'Số người dùng', 'Số kịch bản'];
    const rows = this.filteredApps.map(app => [
      app.id,
      `"${app.name.replace(/"/g, '""')}"`,
      `"${app.creator.replace(/"/g, '""')}"`,
      app.createdAt,
      `"${app.category.replace(/"/g, '""')}"`,
      app.status,
      app.channels.join('; '),
      app.userCount,
      app.scriptCount
    ]);

    // UTF-8 BOM encoding for Vietnamese character support in Excel
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `danh_sach_ung_dung_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.toast.success('Đã xuất danh sách thành công');
  }

  logout(): void {
    sessionStorage.removeItem('is_authenticated');
    this.toast.info('Đã đăng xuất');
    this.router.navigate(['/login']);
  }
}
