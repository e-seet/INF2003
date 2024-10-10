import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../services/login.service';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule] 
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  password: string = '';
  confirmPassword: string = '';
  organizationName: string = ''; 
  errorMessage: string = '';

  // Validation Error Messages
  nameError: string = '';
  emailError: string = '';
  phoneNumberError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';
  organizationNameError: string = ''; 

  constructor(private router: Router, private loginService: LoginService) {}

  // Method to handle registration
  register() {
    // Reset error messages
    this.resetErrors();

    // Validate fields
    if (!this.name) {
      this.nameError = 'Name is required';
    }

    if (!this.email || !this.validateEmail(this.email)) {
      this.emailError = 'Valid email is required';
    }

    if (!this.phoneNumber || !this.validatePhoneNumber(this.phoneNumber)) {
      this.phoneNumberError = 'Valid phone number is required';
    }

    if (!this.organizationName) {
      this.organizationNameError = 'Organization Name is required'; 
    }

    if (!this.password || this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters long';
    }

    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
    }

    // If no validation errors, proceed with registration
    if (
      !this.nameError &&
      !this.emailError &&
      !this.phoneNumberError &&
      !this.organizationNameError && // Include check for organizationNameError
      !this.passwordError &&
      !this.confirmPasswordError
    ) {
      // Construct user data object
      const userData = {
        Name: this.name,
        Password: this.password,
        Email: this.email,
        Phone: this.phoneNumber,
        OrganizationName: this.organizationName 
      };

      // Call the registerUser method from LoginService to send a POST request to the backend
      this.loginService.registerUser(userData)
        .subscribe({
          next: (data) => {
            console.log('User registered successfully:', data);
            alert('Registration successful! Welcome, ' + this.name);
            this.router.navigate(['/login']); // Redirect to login page on success
          },
          error: (error) => {
            console.error('Error during registration:', error);
            this.errorMessage = 'Registration failed. Please try again.';
          },
          complete: () => console.log('Registration request completed.')
        });
    } else {
      this.errorMessage = 'Please fix the above errors and try again.';
    }
  }

  // Helper method to reset error messages
  resetErrors() {
    this.nameError = '';
    this.emailError = '';
    this.phoneNumberError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.organizationNameError = ''; 
    this.errorMessage = '';
  }

  // Validate email format
  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  // Validate phone number format
  validatePhoneNumber(phoneNumber: string): boolean {
    const phonePattern = /^\+?\d{6,15}$/; // Accepts numbers with or without '+' and 6-15 digits
    return phonePattern.test(phoneNumber);
  }
}
