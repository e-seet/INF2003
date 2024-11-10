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
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { EventsService } from "../services/events.service";

@Component({
  selector: 'app-edit-ticket',
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
  templateUrl: './edit-ticket.component.html',
  styleUrl: './edit-ticket.component.css'
})
export class EditTicketComponent {
  constructor(
    private eventService: EventsService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {}
  editTicketForm!: FormGroup;

  myControl = new FormControl(); // Control for the mat-select
  options: string[] = ["Standard", "Premium", "VIP"];
  selectedTickets: string[] = [];

  successMessage: string = '';
  errorMessage: string = '';

  TicketPrice: number = 0; // Hold ticket price
  adjustedTicketPrice: number = 0; // Hold adjusted price

  ngOnInit() {
    // Initialize form with validation
    this.editTicketForm = this.fb.group({
      ticketType: this.myControl,
    });

    // Whenever the form control value changes, update the selected tickets array
    this.myControl.valueChanges.subscribe((selectedValues) => {
      this.selectedTickets = selectedValues;
    });

    // Get event ID from the route and fetch ticket details
    var id = this.route.snapshot.paramMap.get("id");
    console.log(id);

    this.eventService.viewTicketDetails(id).subscribe({
      next: (data: any) => {
        console.log("Received data:", data);

        this.editTicketForm.patchValue({
          ticketType: data[0].UserEvents[0].TicketType,
        });

        this.TicketPrice = data[0].TicketPrice;
        this.adjustTicketPrice();
      },
      error: (error) => {
        this.errorMessage = "Failed to load event details.";
        console.error("Error loading event details:", error);
      }
    });
  }

    // Method to adjust the ticket price
    adjustTicketPrice() {
      switch (this.editTicketForm.value.ticketType) {
        case "Premium":
          this.adjustedTicketPrice = parseFloat(
            (this.TicketPrice * 1.5).toFixed(2),
          ); // 2 d.p.
          break;
        case "VIP":
          this.adjustedTicketPrice = parseFloat(
            (this.TicketPrice * 2).toFixed(2),
          );
          break;
        default:
          this.adjustedTicketPrice = this.TicketPrice;
      }
    }

  onSubmit() {
    console.log(this.selectedTickets);
    var eventId = this.route.snapshot.paramMap.get("id");
    let updatedTicketData = {
      ...this.editTicketForm.value,
    };
    // Call the service method to update ticket
    this.eventService.updateTicket(eventId, updatedTicketData).subscribe({
      next: () => {
        // Handle success response
        this.successMessage = "Ticket type updated successfully!";
        this.errorMessage = ""; // Clear any previous error message
        this.router.navigate(["/myticket/" + eventId]); // Redirect to details page
      },
      error: (error) => {
        // Handle error response
        this.errorMessage = "Failed to update ticket.";
        console.error("Error updating ticket:", error);
      },
    });
  }
}
