import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Application } from '../../../../models/application.model';

@Component({
  selector: 'app-app-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app-form-modal.component.html',
  styleUrls: ['./app-form-modal.component.scss']
})
export class AppFormModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() isEditMode: boolean = false;
  @Input() application: Application | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{
    id?: number;
    name: string;
    creator: string;
    createdAt: string;
    category: string;
    status: 'Đang sử dụng' | 'Tạm khóa';
    channels: ('facebook' | 'web')[];
    userCount: number;
    scriptCount: string;
  }>();

  appForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.appForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      creator: ['', Validators.required],
      createdAt: [''],
      category: ['Sản phẩm điện tử', Validators.required],
      status: ['Đang sử dụng', Validators.required],
      userCount: [100],
      scriptCount: ['01'],
      facebookChannel: [false],
      webChannel: [true]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['application'] || changes['isOpen']) {
      if (this.isOpen && this.application && this.isEditMode) {
        this.appForm.patchValue({
          name: this.application.name,
          creator: this.application.creator,
          createdAt: this.application.createdAt,
          category: this.application.category,
          status: this.application.status,
          userCount: this.application.userCount,
          scriptCount: this.application.scriptCount,
          facebookChannel: this.application.channels.includes('facebook'),
          webChannel: this.application.channels.includes('web')
        });
      } else if (this.isOpen && !this.isEditMode) {
        const now = new Date();
        const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
        this.appForm.reset({
          name: '',
          creator: 'Quản trị viên',
          createdAt: dateStr,
          category: 'Sản phẩm điện tử',
          status: 'Đang sử dụng',
          userCount: 100,
          scriptCount: '01',
          facebookChannel: false,
          webChannel: true
        });
      }
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    if (this.appForm.invalid) {
      this.appForm.markAllAsTouched();
      return;
    }

    const val = this.appForm.value;
    const channels: ('facebook' | 'web')[] = [];
    if (val.facebookChannel) channels.push('facebook');
    if (val.webChannel) channels.push('web');

    this.save.emit({
      id: this.application?.id,
      name: val.name,
      creator: val.creator,
      createdAt: val.createdAt,
      category: val.category,
      status: val.status,
      channels,
      userCount: val.userCount,
      scriptCount: val.scriptCount
    });
  }
}
