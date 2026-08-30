import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Application, ApplicationFilter } from '../../../../models/application.model';
import { TableActionsComponent } from '../../../../shared/components/table-actions/table-actions.component';

@Component({
  selector: 'app-app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, TableActionsComponent],
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.scss']
})
export class AppTableComponent {
  @Input() applications: Application[] = [];
  @Input() totalCount: number = 0;
  @Input() sortColumn: string = 'id';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';

  @Input() categoryList: string[] = [
    'Chăm sóc khách hàng',
    'Tư vấn bán hàng',
    'Sản phẩm điện tử',
    'Tài chính - Ngân hàng',
    'Thời trang',
    'Giáo dục',
    'Y tế - Sức khỏe',
    'Khác'
  ];

  @Output() filterChange = new EventEmitter<ApplicationFilter>();
  @Output() sortChange = new EventEmitter<{ column: string; direction: 'asc' | 'desc' }>();
  @Output() edit = new EventEmitter<Application>();
  @Output() toggleLock = new EventEmitter<Application>();
  @Output() delete = new EventEmitter<Application>();

  nameFilter: string = '';
  creatorFilter: string = '';
  dateFilter: string = '';
  categoryFilter: string = '';
  statusFilter: string = '';
  channelFilter: string = '';
  userFilter: string = '';
  scriptFilter: string = '';

  applyFilters(): void {
    this.filterChange.emit({
      name: this.nameFilter,
      creator: this.creatorFilter,
      createdAt: this.dateFilter,
      category: this.categoryFilter,
      status: this.statusFilter,
      channel: this.channelFilter,
      userCount: this.userFilter,
      scriptCount: this.scriptFilter
    });
  }

  toggleSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortChange.emit({ column: this.sortColumn, direction: this.sortDirection });
  }

  onEdit(app: Application): void {
    this.edit.emit(app);
  }

  onToggleLock(app: Application): void {
    this.toggleLock.emit(app);
  }

  onDelete(app: Application): void {
    this.delete.emit(app);
  }
}
