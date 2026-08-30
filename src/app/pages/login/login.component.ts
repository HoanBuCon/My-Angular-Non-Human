import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toast = inject(ToastService);
  private destroyRef = inject(DestroyRef);

  loginForm!: FormGroup;
  showPassword = false;
  failedAttempts = 0;
  isLocked = false;
  lockoutSeconds = 60;
  isSubmitted = false;

  private readonly MAX_ATTEMPTS = 5;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    const storedAttempts = parseInt(sessionStorage.getItem('login_failed_attempts') || '0', 10);
    this.failedAttempts = storedAttempts;

    if (this.failedAttempts >= this.MAX_ATTEMPTS) {
      this.startLockout();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.isLocked) {
      this.toast.error('Tài khoản đang bị tạm khóa. Vui lòng chờ hết thời gian đếm ngược!');
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toast.error('Bạn đã nhập sai tài khoản hoặc mật khẩu');
      return;
    }

    const { username, password } = this.loginForm.value;
    const usernameVal = username.trim();

    // Tài khoản test chuẩn
    const isSuccess = (usernameVal === 'admin@vss.vn' || usernameVal === 'admin') && password === '123456';

    if (!isSuccess) {
      this.failedAttempts++;
      sessionStorage.setItem('login_failed_attempts', this.failedAttempts.toString());

      if (this.failedAttempts >= this.MAX_ATTEMPTS) {
        this.startLockout();
      } else {
        const remaining = this.MAX_ATTEMPTS - this.failedAttempts;
        this.toast.error(`Bạn đã nhập sai tài khoản hoặc mật khẩu (Còn ${remaining} lần thử)`);
      }
      return;
    }

    // Đăng nhập thành công
    this.failedAttempts = 0;
    sessionStorage.setItem('login_failed_attempts', '0');
    sessionStorage.setItem('is_authenticated', 'true');

    this.toast.success('Đăng nhập thành công! Đang chuyển hướng...');
    setTimeout(() => {
      this.router.navigate(['/apps']);
    }, 1000);
  }

  private startLockout(): void {
    this.isLocked = true;
    const initialSeconds = 60;
    this.lockoutSeconds = initialSeconds;
    this.toast.error(`Bạn đã nhập sai quá ${this.MAX_ATTEMPTS} lần. Tài khoản tạm thời bị khóa 60 giây!`, 5000);

    // Sử dụng RxJS timer thay thế setInterval thủ công
    timer(0, 1000)
      .pipe(
        take(initialSeconds + 1),
        map(elapsed => initialSeconds - elapsed),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: remaining => {
          this.lockoutSeconds = remaining;
          if (remaining <= 0) {
            this.isLocked = false;
            this.failedAttempts = 0;
            sessionStorage.setItem('login_failed_attempts', '0');
            this.toast.info('Hết thời gian chờ. Bạn có thể đăng nhập lại.');
          }
        }
      });
  }
}
