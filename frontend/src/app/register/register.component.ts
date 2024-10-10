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
  imports: [FormsModule, CommonModule] // Import FormsModule and CommonModule
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  // Validation Error Messages
  nameError: string = '';
  emailError: string = '';
  phoneNumberError: string = '';
  passwordError: string = '';
  confirmPasswordError: string = '';

  constructor(private router: Router, private loginService: LoginService) {}

  register2(){

		// Take note that i am passing my temp variable
		var theVariable2 = {
			Name: "eddie",
			Password: "123eddie321",
			Email: "13eddie07@gmail.com",
			Phone: "91234567",
			OrganizationName:"Peters-Chavez"
		}
		this.loginService.registerUser(theVariable2)
		.subscribe({
			next: (data) => {
				console.log(data);
			},
			error: (error) => {
			  console.error('Error:', error);
			},
			complete: () => {
			  console.log('Completed the call'); // Complete callback
			},
		})
	}

  // Method to handle registration
  register() {
    this.resetErrors(); // Reset error messages

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
      !this.passwordError &&
      !this.confirmPasswordError
    ) {
      // Simulate successful registration
      this.errorMessage = '';
      alert(`Registration successful! Welcome, ${this.name}`);
      this.router.navigate(['/login']); // Redirect to login page
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
    this.errorMessage = '';
  }

  // Validate email format
  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  // Validate phone number format
  validatePhoneNumber(phoneNumber: string): boolean {
    const phonePattern = /^\+?\d{10,15}$/; // Accepts numbers with or without '+' and 10-15 digits
    return phonePattern.test(phoneNumber);
  }
}
