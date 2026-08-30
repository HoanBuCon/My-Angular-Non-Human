import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AssignedUser, CreateAppWizardPayload } from '../../../../models/application.model';
import { TableActionsComponent } from '../../../../shared/components/table-actions/table-actions.component';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-create-app-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableActionsComponent],
  templateUrl: './create-app-wizard.component.html',
  styleUrls: ['./create-app-wizard.component.scss']
})
export class CreateAppWizardComponent {
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

  @Output() complete = new EventEmitter<CreateAppWizardPayload>();
  @Output() cancel = new EventEmitter<void>();

  currentStep: number = 1;
  createForm: FormGroup;

  assignedUsers: AssignedUser[] = [
    { id: 1, name: 'Nguyễn Thị Bích', email: 'bichnguyen@vss.com.vn', role: 'Quản trị viên' },
    { id: 2, name: 'Trần Văn Nam', email: 'namtran@vss.com.vn', role: 'Tư vấn viên' }
  ];

  searchUserEmail: string = '';
  selectedUserRole: string = '';
  roleList: string[] = ['Quản trị viên', 'Tư vấn viên', 'Nhân viên'];

  assignNameFilter: string = '';
  assignEmailFilter: string = '';
  assignRoleFilter: string = 'all';
  assignSortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private fb: FormBuilder,
    private toast: ToastService
  ) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: ['']
    });
  }

  get filteredAssignedUsers(): AssignedUser[] {
    let result = [...this.assignedUsers];

    if (this.assignNameFilter.trim()) {
      const q = this.assignNameFilter.toLowerCase().trim();
      result = result.filter(u => u.name.toLowerCase().includes(q));
    }

    if (this.assignEmailFilter.trim()) {
      const q = this.assignEmailFilter.toLowerCase().trim();
      result = result.filter(u => u.email.toLowerCase().includes(q));
    }

    if (this.assignRoleFilter && this.assignRoleFilter !== 'all') {
      result = result.filter(u => u.role === this.assignRoleFilter);
    }

    result.sort((a, b) => {
      if (this.assignSortDirection === 'asc') {
        return a.id - b.id;
      }
      return b.id - a.id;
    });

    return result;
  }

  setStep(step: number): void {
    if (step === 2 && !this.createForm.get('category')?.value) {
      this.toast.warning('Vui lòng chọn lĩnh vực để tiếp tục');
      return;
    }
    if (step === 3) {
      this.saveCreateApp();
      return;
    }
    this.currentStep = step;
  }

  nextStep(): void {
    if (this.currentStep === 1) {
      if (!this.createForm.get('category')?.value) {
        this.toast.warning('Vui lòng chọn lĩnh vực');
        return;
      }
      this.currentStep = 2;
    }
  }

  prevStep(): void {
    if (this.currentStep === 2) {
      this.currentStep = 1;
    }
  }

  goBackToList(): void {
    this.cancel.emit();
  }

  addUserToApp(): void {
    const email = this.searchUserEmail.trim();
    if (!email) {
      this.toast.warning('Vui lòng nhập email nhân viên');
      return;
    }
    if (!this.selectedUserRole) {
      this.toast.warning('Vui lòng chọn quyền hạn');
      return;
    }

    const existing = this.assignedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      this.toast.warning('Nhân viên này đã được thêm vào danh sách');
      return;
    }

    const namePart = email.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const newUser: AssignedUser = {
      id: this.assignedUsers.length > 0 ? Math.max(...this.assignedUsers.map(u => u.id)) + 1 : 1,
      name: formattedName,
      email: email,
      role: this.selectedUserRole as 'Quản trị viên' | 'Tư vấn viên' | 'Nhân viên'
    };

    this.assignedUsers.push(newUser);
    this.searchUserEmail = '';
    this.selectedUserRole = '';
    this.toast.success(`Đã thêm nhân viên ${formattedName} thành công`);
  }

  removeAssignedUser(id: number): void {
    const user = this.assignedUsers.find(u => u.id === id);
    this.assignedUsers = this.assignedUsers.filter(u => u.id !== id);
    if (user) {
      this.toast.success(`Đã xóa nhân viên ${user.name} khỏi ứng dụng`);
    }
  }

  toggleAssignSort(): void {
    this.assignSortDirection = this.assignSortDirection === 'asc' ? 'desc' : 'asc';
  }

  saveCreateApp(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.currentStep = 1;
      this.toast.warning('Vui lòng hoàn thành thông tin ứng dụng');
      return;
    }

    const formVal = this.createForm.value;
    this.complete.emit({
      name: formVal.name,
      category: formVal.category,
      description: formVal.description || '',
      assignedUsers: [...this.assignedUsers]
    });
  }
}
