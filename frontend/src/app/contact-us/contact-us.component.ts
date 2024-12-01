import { Component } from "@angular/core";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { ContactusService } from "../services/contactus.service";

@Component({
  selector: "app-contact-us",
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.css"],
})
export class ContactUsComponent {
  contactForm: FormGroup;
  successMessage = "";
  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private contactus: ContactusService,
  ) {
    this.contactForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      message: ["", Validators.required],
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      this.contactus.submitContactUs(this.contactForm.value).subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.error("Error:", error);
        },
        complete: () => {
          console.log("Completed the call"); // Complete callback
        },
      });
    }
  }
}
