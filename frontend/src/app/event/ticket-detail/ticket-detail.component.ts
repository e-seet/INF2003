import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { LoginService } from "../../services/login.service";
import { EventsService } from "../../services/events.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-ticket-detail",
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule, // For <mat-form-field>
    MatSelectModule, // For <mat-select>
    ReactiveFormsModule, // I
    MatCardModule,
    MatButton,
  ],
  templateUrl: "./ticket-detail.component.html",
  styleUrl: "./ticket-detail.component.css",
})
export class TicketDetailComponent {
  ticket: any = {
    UserID: null,
    EventID: null,
    TicketType: null,
    PurchaseDate: null,
  };

  adjustedTicketPrice: number = 0; // Hold adjusted price
  sponsorshipAmount: number = 0; // Hold sponsorship amount

  constructor(
    public httpClient: HttpClient,
    private loginService: LoginService,
    private eventService: EventsService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // get all my tickets
    var id = this.route.snapshot.paramMap.get("id");

    this.eventService.viewTicketDetails(id).subscribe({
      next: (data) => {
        console.log("myticket");

        this.ticket.EventName = data[0]["EventName"];
        this.ticket.EventID = data[0]["EventID"];
        this.ticket.EventDate = new Date(data[0]["EventDate"]);
        this.ticket.TicketPrice = data[0]["TicketPrice"];
        this.ticket.VenueName = data[0]["Venue"]["VenueName"];
        this.ticket.VenueLocation = data[0]["Venue"]["Location"];
        this.ticket.Organizer = data[0]?.Organization?.OrganizationName ?? "";
        this.ticket.ticketType = data[0]["UserEvents"][0]["TicketType"];
        this.ticket.PurchaseDate = data[0]["UserEvents"][0]["PurchaseDate"];
        this.ticket.Host = data[0]?.User?.Name ?? "";
        this.adjustTicketPrice(); // Adjust price when data is loaded
      },
      error: (error) => {
        console.error("Error:", error);
      },
      complete: () => {
        console.log("Completed the call"); // Complete callback
      },
    });
  }

// Method to adjust the ticket price based on ticket type
adjustTicketPrice() {
  switch (this.ticket.ticketType) {
    case "Premium":
      this.adjustedTicketPrice = parseFloat(
        (this.ticket.TicketPrice * 1.5).toFixed(2),
      );
      break;
    case "VIP":
      this.adjustedTicketPrice = parseFloat(
        (this.ticket.TicketPrice * 2).toFixed(2),
      );
      break;
    default:
      this.adjustedTicketPrice = this.ticket.TicketPrice;
  }
}

  goBack() {
    this.router.navigate(["/myticket"]); // Redirect to events list or another page
  }
}
