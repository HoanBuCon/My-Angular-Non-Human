import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      workEmail: ['', [Validators.required, Validators.email]],
      companyName: ['', Validators.required],
      country: ['', Validators.required],
      industry: ['', Validators.required],
      jobTitle: ['', Validators.required],
      purpose: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    this.toast.success('Đăng ký trải nghiệm thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }
}
