import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private loginService: LoginService, private router: Router) {}

  // Method to handle login
  login() {
    // Check if email or password is empty
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return; // Stop further execution if validation fails
    }

    // Clear previous error messages
    this.errorMessage = '';

    // Prepare login data
    const loginData = {
      Email: this.email,
      Password: this.password,
    };

    // Call the loginUser method from the LoginService
    this.loginService.loginUser(loginData).subscribe({
      next: (data) => {
        console.log('Login successful!', data);
        alert('Login successful!');
        this.router.navigate(['/dashboard']); // Redirect to a dashboard or homepage
      },
      error: (error) => {
        console.error('Error during login:', error);
        this.errorMessage = 'Login failed. Please check your credentials and try again.';
      }
    });
  }

  // Method to handle register button click
  register() {
    this.router.navigate(['/register']); 
  }
}
@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule // Include FormsModule here
  ],
  exports: [LoginComponent]
})
export class LoginModule { }