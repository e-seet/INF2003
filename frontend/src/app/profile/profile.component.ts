import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: true,
  imports: [
	MatButtonModule,
	MatFormFieldModule,
	ReactiveFormsModule,
	MatIconModule,
	MatInputModule,
	CommonModule // for ngif ng for
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
	
	form: FormGroup;
	selectedFiles: File[] = [];  // Array to hold multiple files

	constructor(
		private fb: FormBuilder,
		private loginService: LoginService
	) {
		this.form = this.fb.group({
			file: [null],
		  });
	}

	editProfileForm!: FormGroup;

  // Handler for file input change (for multiple files)
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files); // Convert FileList to array
      // Append new files to the existing selectedFiles array
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      console.log('Selected files:', this.selectedFiles);
    }
  }

  // Remove a file from the list
  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);  // Remove the file at the given index
    console.log('Remaining files after removal:', this.selectedFiles);
  }
	
  onUpload(): void {
	console.log("onSubmit2: upload files")
    if (this.selectedFiles.length > 0) {
      const formData = new FormData();
      // Append each file to the FormData object
      this.selectedFiles.forEach((file, index) => {
        formData.append(`file${index + 1}`, file, file.name);
      });

      // You can now send 'formData' to the server using HttpClient
      console.log('Form data prepared for upload with multiple files:', formData);
      // Example: this.http.post('your-endpoint', formData).subscribe();
    }
  }
	  
	ngOnInit()
	{
		this.editProfileForm = this.fb.group({
			name: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			phone: [''],
			company: [''],
			file:['']
		  });
	  
		this.loginService.getProfile()
		.subscribe({
			next: (data) => {
				console.log("data bakc");
				console.log(data);
				this.editProfileForm.patchValue({
					name: data.Name,
					email: data.Email,
					phone: data.Phone,
					company: data.organization.OrganizationName})
			},
			error: (error) => {
			  console.error('Error:', error);
			},
			complete: () => {
			  console.log('Completed the call'); // Complete callback
			},
		  });	
	}

	  // Method to handle form submission
	  onSubmit(): void {
		console.log("onsubmit\n");
		if (this.editProfileForm.valid) {
		  console.log('Form Submitted', this.editProfileForm.value);
		  // Here you can send the form data to the backend to save the changes
		} else {
		  console.log('Form is invalid');
		}
	  }
}
