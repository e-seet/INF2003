import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf

@Component({
  standalone: true, // Declare this component as a standalone component
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule] // Include both FormsModule and CommonModule
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  // Method to handle login button click
  login() {
    if (this.username === '' || this.password === '') {
      this.errorMessage = 'Please enter both username and password.';
    } else {
      // Simulate successful login
      this.errorMessage = '';
      alert(`Welcome, ${this.username}! You have successfully logged in.`);
      this.router.navigate(['/home']); // Mock redirect to home page
    }
  }

  // Method to handle register button click
  register() {
    this.router.navigate(['/register']); // Mock redirect to register page
  }
}
