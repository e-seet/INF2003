import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { EventsService } from "../services/events.service";
import { LoginService } from "../services/login.service";
import { OrderConfirmService } from "../services/order-confirm.service";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";

import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatButtonModule } from "@angular/material/button";

import { DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-event-details",
  standalone: true,
  imports: [
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: "./event-details.component.html",
  styleUrl: "./event-details.component.css",
})
export class EventDetailsComponent {
  // eventId: number | null = null;
  event: any = {
    EventID: null,
    EventDate: null,
    TicketPrice: null,
    VenueName: "",
    VenueLocation: "",
  };

  selectedTicketType: string = "Standard"; //Default to Standard
  adjustedTicketPrice: number = 0; // Hold adjusted price
  sponsorshipAmount: number = 0; // Hold sponsorship amount
  userId: number | null = null; // To hold userID

  constructor(
    private eventService: EventsService,
    private orderConfirmService: OrderConfirmService,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
  ) {}

  ngOnInit() {
    var id = this.route.snapshot.paramMap.get("id");
    console.log(id);
    // this.eventId = id !== null ? parseInt(id, 10) : null;

    this.eventService.viewEventDetails(id).subscribe({
      next: (data) => {
        this.event.EventName = data[0]["EventName"];
        this.event.EventID = data[0]["EventID"];
        this.event.EventDate = new Date(data[0]["EventDate"]);
        this.event.TicketPrice = data[0]["TicketPrice"];
        this.event.VenueName = data[0]["Venue"]["VenueName"];
        this.event.VenueLocation = data[0]["Venue"]["Location"];
        this.event.Organizer = data[0]["Organization"]["OrganizationName"];
        this.adjustTicketPrice(); // Adjust price when data is loaded
      },
      error: (error) => {
        console.error("Error:", error);
      },
      complete: () => {
        console.log("Completed the call"); // Complete callback
      },
    });

    // Retrieve the user ID from the JWT token
    this.userId = this.loginService.getUserIdFromToken();
    console.log("User ID from token:", this.userId);
  }

  // Method to adjust the ticket price
  adjustTicketPrice() {
    switch (this.selectedTicketType) {
      case "Premium":
        this.adjustedTicketPrice = parseFloat(
          (this.event.TicketPrice * 1.5).toFixed(2),
        ); // 2 d.p.
        break;
      case "VIP":
        this.adjustedTicketPrice = parseFloat(
          (this.event.TicketPrice * 2).toFixed(2),
        );
        break;
      default:
        this.adjustedTicketPrice = this.event.TicketPrice;
    }
  }

  // Method to buy ticket
  buyTicket() {
    if (!this.userId) {
      alert("User is not logged in");
      return;
    }

    const eventData = {
      UserID: this.userId,
      EventID: this.event.EventID,
      TicketType: this.selectedTicketType,
      PurchaseDate: new Date(),
    };

    this.eventService.purchaseTicket(eventData).subscribe({
      next: (response) => {
        console.log("Ticket purchased successfully", response);
        // Store order details in the OrderConfirmService
        this.orderConfirmService.setOrderData({
          eventDate: this.event.EventDate,
          eventName: this.event.EventName,
          venue: this.event.VenueName,
          ticketType: this.selectedTicketType,
          total: this.adjustedTicketPrice,
        });
        // Redirect to /order-confirmation page
        this.router.navigate(["/order-confirmation"], {});
      },
      error: (error) => {
        console.error("Error purchasing ticket:", error);
        alert(
          "Error: You are permitted to purchase only one ticket per event listed. Please use the dashboard to modify the ticket.",
        );
      },
    });
  }

  // Method to handle sponsorship
  sponsorEvent() {
    if (!this.userId || !this.sponsorshipAmount) {
      alert("Please enter a sponsorship amount.");
      return;
    }

    const sponsorData = {
      UserID: this.userId,
      EventID: this.event.EventID,
      SponsorshipAmount: this.sponsorshipAmount,
    };

    this.eventService.submitSponsorship(sponsorData).subscribe({
      next: (response) => {
        alert("Sponsorship submitted successfully!");
        console.log("Sponsorship response:", response);
      },
      error: (error) => {
        alert(
          "Error: You are permitted to sponsor only once per event listed. Please use the dashboard to modify the sponsorship amount.",
        );
        console.error("Error:", error);
      },
    });
  }
}
