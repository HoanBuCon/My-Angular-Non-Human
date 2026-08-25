import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Application } from '../../models/application.model';
import { ApplicationService } from '../../services/application.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-app-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.scss']
})
export class AppListComponent implements OnInit {
  applications: Application[] = [];
  filteredApps: Application[] = [];

  // Filter state
  nameFilter: string = '';
  creatorFilter: string = '';
  dateFilter: string = '';
  categoryFilter: string = '';
  statusFilter: string = '';
  channelFilter: string = '';
  userFilter: string = '';
  scriptFilter: string = '';

  // Sort state
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Pagination state
  pageSize: number = 10;
  currentPage: number = 1;
  pageSizeOptions: number[] = [10, 20, 50];

  // Modals state
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  selectedAppId: number | null = null;
  appForm!: FormGroup;

  isDeleteModalOpen: boolean = false;
  appToDelete: Application | null = null;

  // Sidebar state
  isSidebarCollapsed: boolean = false;

  constructor(
    private appService: ApplicationService,
    private fb: FormBuilder,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.appService.getApplications().subscribe(apps => {
      this.applications = apps;
      this.applyFilters();
    });
  }

  private initForm(): void {
    this.appForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      creator: ['', [Validators.required]],
      createdAt: [this.getCurrentDateFormatted(), [Validators.required]],
      category: ['Sản phẩm điện tử', [Validators.required]],
      status: ['Đang sử dụng', [Validators.required]],
      facebookChannel: [true],
      webChannel: [false],
      userCount: [100, [Validators.required, Validators.min(0)]],
      scriptCount: ['01', [Validators.required]]
    });
  }

  private getCurrentDateFormatted(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  applyFilters(): void {
    let result = [...this.applications];

    if (this.nameFilter.trim()) {
      const q = this.nameFilter.toLowerCase().trim();
      result = result.filter(app => app.name.toLowerCase().includes(q));
    }

    if (this.creatorFilter.trim()) {
      const q = this.creatorFilter.toLowerCase().trim();
      result = result.filter(app => app.creator.toLowerCase().includes(q));
    }

    if (this.dateFilter) {
      result = result.filter(app => app.createdAt === this.dateFilter);
    }

    if (this.categoryFilter) {
      result = result.filter(app => app.category === this.categoryFilter);
    }

    if (this.statusFilter) {
      result = result.filter(app => app.status === this.statusFilter);
    }

    if (this.channelFilter) {
      result = result.filter(app => app.channels.includes(this.channelFilter as any));
    }

    if (this.scriptFilter.trim()) {
      const q = this.scriptFilter.trim();
      result = result.filter(app => app.scriptCount.includes(q));
    }

    // Apply Sorting
    result.sort((a, b) => {
      let valA: any = (a as any)[this.sortColumn];
      let valB: any = (b as any)[this.sortColumn];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredApps = result;
    this.currentPage = 1;
  }

  toggleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  get pagedApps(): Application[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredApps.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredApps.length / this.pageSize) || 1;
  }

  get startIndex(): number {
    if (this.filteredApps.length === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredApps.length);
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedAppId = null;
    this.appForm.reset({
      name: '',
      creator: '',
      createdAt: this.getCurrentDateFormatted(),
      category: 'Sản phẩm điện tử',
      status: 'Đang sử dụng',
      facebookChannel: true,
      webChannel: false,
      userCount: 100,
      scriptCount: '01'
    });
    this.isModalOpen = true;
  }

  openEditModal(app: Application): void {
    this.isEditMode = true;
    this.selectedAppId = app.id;
    this.appForm.patchValue({
      name: app.name,
      creator: app.creator,
      createdAt: app.createdAt,
      category: app.category,
      status: app.status,
      facebookChannel: app.channels.includes('facebook'),
      webChannel: app.channels.includes('web'),
      userCount: app.userCount,
      scriptCount: app.scriptCount
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedAppId = null;
  }

  saveApplication(): void {
    if (this.appForm.invalid) {
      this.appForm.markAllAsTouched();
      this.toast.error('Vui lòng nhập đầy đủ thông tin hợp lệ!');
      return;
    }

    const val = this.appForm.value;
    const channels: ('facebook' | 'web')[] = [];
    if (val.facebookChannel) channels.push('facebook');
    if (val.webChannel) channels.push('web');

    const appData = {
      name: val.name,
      creator: val.creator,
      createdAt: val.createdAt,
      category: val.category,
      status: val.status as 'Đang sử dụng' | 'Tạm khóa',
      channels: channels.length > 0 ? channels : (['facebook'] as ('facebook' | 'web')[]),
      userCount: Number(val.userCount) || 0,
      scriptCount: String(val.scriptCount).padStart(2, '0')
    };

    if (this.isEditMode && this.selectedAppId !== null) {
      this.appService.updateApplication(this.selectedAppId, appData);
      this.toast.success('Cập nhật ứng dụng thành công!');
    } else {
      this.appService.addApplication(appData);
      this.toast.success('Thêm ứng dụng mới thành công!');
    }

    this.closeModal();
  }

  toggleStatus(app: Application): void {
    this.appService.toggleStatus(app.id);
    const statusMsg = app.status === 'Đang sử dụng' ? 'Đã tạm khóa ứng dụng!' : 'Đã kích hoạt ứng dụng!';
    this.toast.info(statusMsg);
  }

  confirmDelete(app: Application): void {
    this.appToDelete = app;
    this.isDeleteModalOpen = true;
  }

  cancelDelete(): void {
    this.appToDelete = null;
    this.isDeleteModalOpen = false;
  }

  deleteApplication(): void {
    if (this.appToDelete) {
      this.appService.deleteApplication(this.appToDelete.id);
      this.toast.success(`Đã xóa ứng dụng "${this.appToDelete.name}"!`);
      this.cancelDelete();
    }
  }

  exportList(): void {
    const headers = ['STT', 'Tên', 'Người tạo', 'Thời gian tạo', 'Lĩnh vực', 'Trạng thái', 'Kênh tương tác', 'Số người dùng', 'Số kịch bản'];
    const rows = this.filteredApps.map((app, index) => [
      index + 1,
      `"${app.name}"`,
      `"${app.creator}"`,
      app.createdAt,
      `"${app.category}"`,
      app.status,
      app.channels.join('; '),
      app.userCount,
      app.scriptCount
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Danh_sach_ung_dung.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.toast.success('Đã xuất danh sách ứng dụng thành công!');
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
