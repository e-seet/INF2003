import { Component } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient, HttpClientModule } from "@angular/common/http";

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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      message: ["", Validators.required],
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.http.post("/api/contact", this.contactForm.value).subscribe({
        next: () => {
          this.successMessage = "Your message has been sent successfully.";
          this.contactForm.reset();
        },
        error: () => {
          this.errorMessage = "There was an error sending your message. Please try again.";
        },
      });
    }
  }
}
