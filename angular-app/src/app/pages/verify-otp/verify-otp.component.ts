import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit, OnDestroy {
  otpForm!: FormGroup;
  resendCountdown = 0;
  isResending = false;
  private timer: any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  resendOtp(): void {
    if (this.isResending) return;

    this.isResending = true;
    this.resendCountdown = 60;
    this.toast.info('Mã OTP mới đã được gửi lại đến email của bạn!');

    this.timer = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        clearInterval(this.timer);
        this.isResending = false;
      }
    }, 1000);
  }

  onSubmit(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      this.toast.error('Vui lòng nhập mã xác minh OTP hợp lệ');
      return;
    }

    this.toast.success('Xác minh OTP thành công!');
    setTimeout(() => {
      this.router.navigate(['/new-password']);
    }, 1000);
  }
}
