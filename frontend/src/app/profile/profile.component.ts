import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [FormsModule, CommonModule]
})
export class ProfileComponent implements OnInit {
  user = {
    name: '',
    email: '',
    phoneNumber: '',
    organizationName: '',
    profilePictureUrl: '' // Add profile picture URL
  };
  errorMessage: string = '';
  successMessage: string = '';
  selectedFile: File | null = null;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // Fetch the current user's details and populate the form
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          organizationName: data.organizationName,
          profilePictureUrl: data.profilePictureUrl // Set profile picture URL
        };
      },
      error: (error) => {
        this.errorMessage = 'Failed to load profile data.';
        console.error('Error fetching profile data:', error);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('profilePicture', this.selectedFile);
      this.userService.uploadProfilePicture(formData).subscribe({
        next: (response) => {
          this.user.profilePictureUrl = response.profilePictureUrl;
          this.updateUserProfile();
        },
        error: (error) => {
          this.errorMessage = 'Failed to upload profile picture.';
          console.error('Error uploading profile picture:', error);
        }
      });
    } else {
      this.updateUserProfile();
    }
  }

  updateUserProfile(): void {
    this.userService.updateUserProfile(this.user).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
      },
      error: (error) => {
        this.errorMessage = 'Failed to update profile.';
        console.error('Error updating profile:', error);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/home']); // Go back to home view
  }
}