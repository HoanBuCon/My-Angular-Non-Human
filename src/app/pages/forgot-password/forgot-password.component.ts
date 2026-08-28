import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      account: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      this.toast.error('Vui lòng nhập tài khoản hoặc email của bạn');
      return;
    }

    const value = this.forgotForm.value.account;
    sessionStorage.setItem('reset_account', value);
    this.toast.success('Mã OTP xác minh đã được gửi đến email của bạn');
    setTimeout(() => {
      this.router.navigate(['/verify-otp']);
    }, 1000);
  }
}
