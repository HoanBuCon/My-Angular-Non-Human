import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery: string = '';

  // Modal State
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  selectedUserId: number | null = null;
  userForm!: FormGroup;
  avatarPreview: string | null = null;

  // Delete Confirmation Modal State
  isDeleteModalOpen: boolean = false;
  userToDelete: User | null = null;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.applyFilter();
    });
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      avatar: ['']
    });
  }

  applyFilter(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedUserId = null;
    this.avatarPreview = null;
    this.userForm.reset();
    this.isModalOpen = true;
  }

  openEditModal(user: User): void {
    this.isEditMode = true;
    this.selectedUserId = user.id;
    this.avatarPreview = user.avatar || null;
    this.userForm.patchValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      avatar: user.avatar
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.avatarPreview = null;
    this.userForm.reset();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.toast.error('Kích thước ảnh không được vượt quá 5MB!');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.avatarPreview = result;
        this.userForm.patchValue({ avatar: result });
        this.toast.info('Đã tải ảnh lên! Nhấn "Lưu thay đổi" để áp dụng.');
      };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar(): void {
    this.avatarPreview = null;
    this.userForm.patchValue({ avatar: '' });
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.toast.error('Vui lòng điền đầy đủ và đúng định dạng các thông tin!');
      return;
    }

    const formValues = this.userForm.value;

    if (this.isEditMode && this.selectedUserId !== null) {
      this.userService.updateUser(this.selectedUserId, formValues);
      this.toast.success('Cập nhật thông tin người dùng thành công!');
    } else {
      this.userService.addUser(formValues);
      this.toast.success('Thêm người dùng mới thành công!');
    }

    this.closeModal();
  }

  confirmDelete(user: User): void {
    this.userToDelete = user;
    this.isDeleteModalOpen = true;
  }

  cancelDelete(): void {
    this.userToDelete = null;
    this.isDeleteModalOpen = false;
  }

  deleteUser(): void {
    if (this.userToDelete) {
      this.userService.deleteUser(this.userToDelete.id);
      this.toast.success(`Đã xóa người dùng ${this.userToDelete.first_name} ${this.userToDelete.last_name}!`);
      this.cancelDelete();
    }
  }

  logout(): void {
    sessionStorage.removeItem('is_authenticated');
    this.toast.info('Đã đăng xuất khỏi hệ thống.');
    this.router.navigate(['/login']);
  }
}
