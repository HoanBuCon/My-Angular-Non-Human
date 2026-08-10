import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-first-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './first-login.component.html',
  styleUrls: ['./first-login.component.scss']
})
export class FirstLoginComponent implements OnInit {
  firstLoginForm!: FormGroup;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.firstLoginForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.firstLoginForm.invalid) {
      this.firstLoginForm.markAllAsTouched();
      this.toast.error('Vui lòng điền đầy đủ thông tin mật khẩu!');
      return;
    }

    const { newPassword, confirmPassword } = this.firstLoginForm.value;

    if (newPassword !== confirmPassword) {
      this.toast.error('Mật khẩu nhập lại không khớp!');
      return;
    }

    this.toast.success('Đổi mật khẩu lần đầu thành công! Vui lòng đăng nhập lại.');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1200);
  }
}
