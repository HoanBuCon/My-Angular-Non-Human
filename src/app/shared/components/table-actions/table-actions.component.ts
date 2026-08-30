import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-actions.component.html',
  styleUrls: ['./table-actions.component.scss']
})
export class TableActionsComponent {
  @Input() showEdit: boolean = true;
  @Input() showLock: boolean = false;
  @Input() showDelete: boolean = true;

  @Input() status: string = 'Đang sử dụng';
  @Input() isLocked: boolean = false;

  @Input() editTooltip: string = 'Chỉnh sửa';
  @Input() lockTooltip: string = 'Tạm khóa';
  @Input() unlockTooltip: string = 'Mở khóa';
  @Input() deleteTooltip: string = 'Xóa';

  @Output() edit = new EventEmitter<void>();
  @Output() toggleLock = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  get isCurrentlyLocked(): boolean {
    return this.isLocked || this.status === 'Tạm khóa';
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit();
  }

  onToggleLock(event: MouseEvent): void {
    event.stopPropagation();
    this.toggleLock.emit();
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.delete.emit();
  }
}
