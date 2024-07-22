import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './service/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(): boolean {
    console.log('AuthGuard: Checking authentication');
    if (!this.userService.isAuthenticated()) {
      console.log('AuthGuard: Not authenticated, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
    console.log('AuthGuard: Authenticated, allowing access');
    return true;
  }
}
