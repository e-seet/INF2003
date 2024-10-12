import { Component, OnInit } from "@angular/core";
import { LoginService } from "../services/login.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { UserService } from "../services/user.service";
import { S3serviceService } from "../../services/s3service.service";

@Component({
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    CommonModule, // for ngif ng for
  ],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent {
  form: FormGroup;
  selectedFiles: File[] = []; // Array to hold multiple files
  blocking = 0;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private s3Service: S3serviceService,
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
      console.log("Selected files:", this.selectedFiles);
    }
  }

  // Remove a file from the list
  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1); // Remove the file at the given index
    console.log("Remaining files after removal:", this.selectedFiles);
  }

  onUpload(): void {
    this.blocking = 1;
    this.selectedFiles.forEach((file) => {
      this.s3Service
        .uploadFile(file)
        .then((response) => {
          console.log("File uploaded successfully:", response.location);
          this.editProfileForm.patchValue({
            file: response.location,
          });

          this.blocking = 0;
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          this.blocking = 0;
        });
    });
  }

  ngOnInit() {
    this.editProfileForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: [""],
      OrganizationName: [""],
      file: [""],
    });

    this.loginService.getProfile().subscribe({
      next: (data: any) => {
        console.log("data bakc");
        console.log(data);
        this.editProfileForm.patchValue({
          name: data.Name,
          email: data.Email,
          phone: data.Phone,
          OrganizationName: data.organization.OrganizationName,
        });
      },
      error: (error) => {
        console.error("Error:", error);
      },
      complete: () => {
        console.log("Completed the call"); // Complete callback
      },
    });
  }

  // Method to handle form submission
  onSubmit(): void {
    console.log("onsubmit\n");
    if (this.editProfileForm.valid && this.blocking == 0) {
      console.log("Form Submitted", this.editProfileForm.value);

      // let profileData = this.editProfileForm.value;
      let profileData = {
        Name: this.editProfileForm.value.name,
        Email: this.editProfileForm.value.email,
        Phone: this.editProfileForm.value.phone,
        OrganizationName: this.editProfileForm.value.OrganizationName,
        Photourl: this.editProfileForm.value.file,
      };
      console.log(profileData);

      this.loginService.editProfile(profileData).subscribe({
        next: (data: any) => {
          console.log("data bakc");
          console.log(data);
        },
        error: (error: any) => {
          console.error("Error:", error);
        },
        complete: () => {
          console.log("Completed the call"); // Complete callback
        },
      });
    } else {
      console.log("Form is invalid");
    }
  }
}
