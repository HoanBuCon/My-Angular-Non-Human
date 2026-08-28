import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { VerifyOtpComponent } from './pages/verify-otp/verify-otp.component';
import { NewPasswordComponent } from './pages/new-password/new-password.component';
import { FirstLoginComponent } from './pages/first-login/first-login.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { AppListComponent } from './pages/app-list/app-list.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'new-password', component: NewPasswordComponent },
  { path: 'first-login', component: FirstLoginComponent },
  { path: 'apps', component: AppListComponent, canActivate: [authGuard] },
  { path: 'app-list', component: AppListComponent, canActivate: [authGuard] },
  { path: 'users', component: UserListComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
