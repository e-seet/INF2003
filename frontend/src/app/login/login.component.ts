import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/login.service'; 

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule] 
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private loginService: LoginService) {} 

  ngOnInit(): void {
    // Check if the user is already logged in and redirect to the home page if so
    if (this.loginService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  // Method to handle login button click
  login() {
    if (this.email === '' || this.password === '') {
      this.errorMessage = 'Please enter both email and password.';
    } else {
      const loginData = { Email: this.email, Password: this.password };
      this.loginService.loginUser(loginData).subscribe({
        next: (data) => {
          alert('Login successful!');
          this.router.navigate(['/home']); // Redirect to home page after login
        },
        error: (error) => {
          this.errorMessage = 'Login failed. Please check your credentials and try again.';
          console.error('Error during login:', error);
        }
      });
    }
  }

  // Method to handle register button click
  register() {
    this.router.navigate(['/register']);
  }
}
