import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true, // Indicates that this component does not belong to an NgModule
  imports: [CommonModule, ReactiveFormsModule], // Import necessary Angular modules
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize the form with controls and validators
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      organizationName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.minLength(6)]],
      confirmPassword: ['', [Validators.minLength(6)]],
    });
  }

  // Method to handle form submission
  onSaveChanges(): void {
    if (this.profileForm.valid) {
      console.log('Profile updated with values:', this.profileForm.value);
      // Implement your save logic here, e.g., call a service to update the profile
    } else {
      console.error('Form is not valid');
    }
  }
}
