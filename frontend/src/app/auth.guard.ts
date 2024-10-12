import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Example auth service
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
	// private authService: AuthService, 
	private loginService: LoginService,
	private router: Router) {}

  canActivate(): boolean {
    // Check if the user is logged in by using the AuthService
    if (this.loginService.isLoggedIn()) {
      return true; // User is logged in, allow access to the route
    } else {
      // User is not logged in, redirect to the login page
      this.router.navigate(['/login']);
      return false; // Block access to the route
    }
  }
}