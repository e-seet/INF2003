import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { EventsService } from "../services/events.service";

@Component({
  selector: 'app-edit-sponsor',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    CommonModule, // for ngif ng for
  ],
  templateUrl: './edit-sponsor.component.html',
  styleUrl: './edit-sponsor.component.css'
})
export class EditSponsorComponent {
  constructor(
    private eventService: EventsService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {}
  editSponsorForm!: FormGroup;
  myControl = new FormControl(); // Control for the mat-select

  successMessage: string = '';
  errorMessage: string = '';

  ngOnInit() {
    // Get event ID from the route and fetch ticket details
    var id = this.route.snapshot.paramMap.get("id");
    console.log(id);

    this.editSponsorForm = this.fb.group({
      SponsorshipAmount: ["", Validators.required],
    });

    this.eventService.viewSponsorDetails(id).subscribe({
      next: (data: any) => {
        console.log("Received data:", data);

        this.editSponsorForm.patchValue({
          SponsorshipAmount: data[0]?.EventSponsors[0]?.SponsorshipAmount,
        });
      },
      error: (error) => {
        this.errorMessage = "Failed to load event details.";
        console.error("Error loading event details:", error);
      }
    });
  }

  onSubmit() {
    if (this.editSponsorForm.value.SponsorshipAmount <= 0) {
      alert("Please enter a sponsorship amount.");
      return;
    }
    var eventId = this.route.snapshot.paramMap.get("id");
    let updatedSponsorData = {
      ...this.editSponsorForm.value,
    };
    // Call the service method to update ticket
    this.eventService.updateSponsor(eventId, updatedSponsorData).subscribe({
      next: () => {
        // Handle success response
        this.successMessage = "Sponsorship updated successfully!";
        this.errorMessage = ""; // Clear any previous error message
        // this.router.navigate(["/myticket/" + eventId]); // Redirect to details page
      },
      error: (error) => {
        // Handle error response
        this.errorMessage = "Failed to update sponsorship.";
        console.error("Error updating sponsorship:", error);
      },
    });
  }
}
