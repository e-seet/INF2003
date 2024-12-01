import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { LoginService } from "../services/login.service";

@Component({
  standalone: true,
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
  imports: [FormsModule, CommonModule],
})
export class RegisterComponent {
  name: string = "";
  email: string = "";
  phoneNumber: string = "";
  password: string = "";
  confirmPassword: string = "";
  organizationName: string = "";
  errorMessage: string = "";

  // Validation Error Messages
  nameError: string = "";
  emailError: string = "";
  phoneNumberError: string = "";
  passwordError: string = "";
  confirmPasswordError: string = "";
  organizationNameError: string = "";

  //   phoneNumberError2: string | null = null;
  phoneNumberValid: boolean = false;
  phoneVerificationCode: string = "";
  emailVerificationCode: string = "";

  emailbackup: string = "";
  phonebackup: string = "";
  emailOTP: boolean = false;
  phoneOTP: boolean = false;
  bothVerified: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
  ) {}

  sendEmailOTP() {
    console.log("send otp");
    console.log(this.email);
    this.loginService.sendemailOTP(this.email).subscribe({
      next: (data) => {
        // console.log("User registered successfully:", data);
        alert("Email Sent!");
        this.emailbackup = this.email;
      },
      error: (error) => {
        console.error("Error during OTP:", error);
        this.errorMessage = "OTP send failed. Please try again.";
      },
      complete: () => {
        this.emailOTP = true;
        console.log("OTP request completed.");
      },
    });
  }

  VerifyEmailOTP() {
    console.log("email otp:");
    console.log(this.emailVerificationCode);

    this.loginService
      .VerifyEmailOTP(this.emailVerificationCode, this.emailbackup)
      .subscribe({
        next: (data) => {
          // console.log("User registered successfully:", data);
          alert("Verified!");
        },
        error: (error) => {
          console.error("Error during Verification:", error);
          this.errorMessage = "Verification failed. Please try again.";
        },
        complete: () => {
          console.log("Verification completed.");
          this.phoneOTP = true;
        },
      });
  }

  sendPhoneOTP() {
    console.log("send otp:");
    this.loginService.sendPhoneOTP(this.phoneNumber).subscribe({
      next: (data) => {
        // console.log("User registered successfully:", data);
        alert("OTP Sent!");
        this.phonebackup = this.phoneNumber;
      },
      error: (error) => {
        console.error("Error during OTP:", error);
        this.errorMessage = "OTP send failed. Please try again.";
      },
      complete: () => console.log("OTP request completed."),
    });
  }

  VerifyPhoneOTP() {
    this.loginService
      .VerifyPhoneOTP(this.phoneVerificationCode, this.phonebackup)
      .subscribe({
        next: (data) => {
          // console.log("User registered successfully:", data);
          alert("Verified!");
        },
        error: (error) => {
          console.error("Error during Verification:", error);
          this.errorMessage = "Verification failed. Please try again.";
        },
        complete: () => {
          console.log("Verification completed.");
          this.phoneOTP = true;
        },
      });
  }

  validatePhoneNumberSMS() {
    // const phoneRegex = /^\+?\d{8}$/; // Accepts numbers with or without '+' and 8-11 digits
    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(this.phoneNumber)) {
      this.phoneNumberError = "Please enter a phone number (8).";
      this.phoneNumberValid = false;
    } else {
      console.log("Valid phone number");
      this.phoneNumberError = ""; // Clear error message
      this.phoneNumberValid = true;
      console.log("sending number");
    }
  }

  verification() {
    if ((this.emailOTP == true && this, this.phoneOTP == true))
      this.loginService.VerifyBoth().subscribe({
        next: (data) => {
          console.log("User validated both", data);
          //   alert("Verified!");
        },
        error: (error) => {
          console.log("error", error);
          //   console.error("Error during Verification:", error);
          //   this.errorMessage = "Verification failed. Please try again.";
        },
        complete: () => {
          //   console.log("Verification completed.");
          //   this.phoneOTP = true;
          this.bothVerified = true;
        },
      });
  }

  // Method to handle registration
  register() {
    // Reset error messages
    this.resetErrors();

    // Validate fields
    if (!this.name) {
      this.nameError = "Name is required";
    }

    if (!this.email || !this.validateEmail(this.email)) {
      this.emailError = "Valid email is required";
    }

    if (!this.phoneNumber || !this.validatePhoneNumber(this.phoneNumber)) {
      this.phoneNumberError = "Valid phone number is required";
    }

    if (!this.organizationName) {
      this.organizationNameError = "Organization Name is required";
    }

    if (!this.password || this.password.length < 6) {
      this.passwordError = "Password must be at least 6 characters long";
    }

    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = "Passwords do not match";
    }

    // check both are done
    if (this.bothVerified == false) {
      this.verification();
    }

    // If no validation errors, proceed with registration
    if (
      !this.nameError &&
      !this.emailError &&
      !this.phoneNumberError &&
      !this.organizationNameError && // Include check for organizationNameError
      !this.passwordError &&
      !this.confirmPasswordError &&
      this.bothVerified == true
    ) {
      // Construct user data object
      const userData = {
        Name: this.name,
        Password: this.password,
        Email: this.email,
        Phone: this.phoneNumber,
        OrganizationName: this.organizationName,
      };

      // Call the registerUser method from LoginService to send a POST request to the backend
      this.loginService.registerUser(userData).subscribe({
        next: (data) => {
          console.log("User registered successfully:", data);
          alert("Registration successful! Welcome, " + this.name);
          this.router.navigate(["/login"]); // Redirect to login page on success
        },
        error: (error) => {
          console.error("Error during registration:", error);
          this.errorMessage = "Registration failed. Please try again.";
        },
        complete: () => console.log("Registration request completed."),
      });
    } else {
      this.errorMessage = "Please fix the above errors and try again.";
    }
  }

  // Helper method to reset error messages
  resetErrors() {
    this.nameError = "";
    this.emailError = "";
    this.phoneNumberError = "";
    this.passwordError = "";
    this.confirmPasswordError = "";
    this.organizationNameError = "";
    this.errorMessage = "";
  }

  // Validate email format
  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  // Validate phone number format
  validatePhoneNumber(phoneNumber: string): boolean {
    // const phonePattern = /^\+?\d{8,10}$/; // Accepts numbers with or without '+' and 8-10 digits
    const phonePattern = /^\d{8}$/;
    return phonePattern.test(phoneNumber);
  }
}
