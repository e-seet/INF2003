import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginService } from '../services/login.service'; 

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, RouterModule] 
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    // Subscribe to login status changes
    this.loginService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  // Method to handle logout button click
  logout() {
    this.loginService.logout(); // Call the logout method in LoginService
    this.router.navigate(['/login']); // Navigate to login page after logout
  }
}
