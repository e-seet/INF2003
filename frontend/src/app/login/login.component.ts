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
  email: string = ''; // Change from username to email
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  // Method to handle login button click
  login() {
    if (this.email === '' || this.password === '') { // Check for email
      this.errorMessage = 'Please enter both email and password.';
    } else {
      // Simulate successful login
      this.errorMessage = '';
      alert(`Welcome, ${this.email}! You have successfully logged in.`);
      this.router.navigate(['/home']); 
    }
  }

  // Method to handle register button click
  register() {
    this.router.navigate(['/register']); 
  }
}
