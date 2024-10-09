import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf and other directives

@Component({
  standalone: true, // Declare the component as standalone
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule] // Include FormsModule and CommonModule
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private router: Router) {}

  // Method to handle registration button click
  register() {
    // Validate form fields
    if (this.name === '' || this.email === '' || this.phoneNumber === '' || this.password === '' || this.confirmPassword === '') {
      this.errorMessage = 'All fields are required.';
    } else if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
    } else if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
    } else if (!this.validatePhoneNumber(this.phoneNumber)) {
      this.errorMessage = 'Please enter a valid phone number.';
    } else {
      // Clear error message and simulate successful registration
      this.errorMessage = '';
      alert(`Registration successful! Welcome, ${this.name}`);
      this.router.navigate(['/login']); // Navigate to login page after registration
    }
  }

  // Method to validate email format
  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  // Method to validate phone number format
  validatePhoneNumber(phoneNumber: string): boolean {
    const phonePattern = /^\+?\d{10,15}$/; // Accepts numbers with or without '+' and 10-15 digits
    return phonePattern.test(phoneNumber);
  }
}
