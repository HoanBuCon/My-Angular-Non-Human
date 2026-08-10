import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  const isAuthenticated = sessionStorage.getItem('is_authenticated') === 'true';

  if (isAuthenticated) {
    return true;
  }

  toast.warning('Vui lòng đăng nhập để truy cập trang quản lý người dùng!');
  router.navigate(['/login']);
  return false;
};
