import { Component, OnInit } from "@angular/core";
import { LoginService } from "../services/login.service";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { EventsService } from "../services/events.service";

@Component({
  standalone: true,
  selector: "app-user-dashboard",
  templateUrl: "./user-dashboard.component.html",
  styleUrls: ["./user-dashboard.component.css"],
  imports: [CommonModule, RouterModule],
})
export class UserDashboardComponent implements OnInit {
  userName: string = "";
  userEmail: string = "";
  photoUrl: string = "";

  // Add these missing properties
  upcomingEvents: any[] = []; // Initialize as an empty array or use a specific type for events
  myEvents: any[] = []; // Initialize as an empty array or use a specific type for events
  notifications: any[] = []; // Initialize as an empty array or use a specific type for notifications

  constructor(
    private loginService: LoginService,

    private eventService: EventsService,
  ) {}

  ngOnInit(): void {
    // Extract user details from the JWT token
    const decodedToken = this.loginService.getDecodedToken();
    if (decodedToken) {
      this.userName = decodedToken.name;
      this.userEmail = decodedToken.email;
      this.photoUrl = decodedToken.photoUrl;

      var x = this.loginService.returnUrl();
      if (x != "") {
        this.photoUrl = x;
      }
    } else {
      console.error("Failed to decode token or token is missing.");
    }

    // get all my upcoming events
    this.eventService.getTickets().subscribe({
      next: (data) => {
        console.log(data);
        this.upcomingEvents = data;
      },
      error: (error) => {
        console.error("Error:", error);
      },
      complete: () => {},
    });

    // get all my events
    this.eventService.displayMyEvents().subscribe({
      next: (data) => {
        console.log(data);
        this.myEvents = data;
      },
      error: (error) => {
        console.error("Error:", error);
      },
      complete: () => {},
    });

    //TEMP DATA
    // this.upcomingEvents = [
    //   //   { id: 1, name: "Event 1", date: new Date(), location: "Location 1" },
    //   //   { id: 2, name: "Event 2", date: new Date(), location: "Location 2" },
    // ];

    //this.myEvents = [
    //   {
    //     id: 3,
    //     name: "My Event 1",
    //     date: new Date(),
    //     location: "My Location 1",
    //   },
    //];
  }

    // Define the deleteTicket method
    deleteTicket(eventId: number): void {
      this.eventService.deleteTicket(eventId).subscribe({
        next: (response) => {
          console.log("Ticket cancelled successfully:", response);
          // Remove the deleted ticket from the frontend
          this.upcomingEvents = this.upcomingEvents.filter(
            (event) => event.Event.EventID !== eventId,
          );
        },
        error: (error) => {
          console.error("Error cancelling Ticket:", error);
        },
      });
    }

  // Define the deleteEvent method
  deleteEvent(eventId: number): void {
    this.eventService.deleteEvent(eventId).subscribe({
      next: (response) => {
        console.log("Event deleted successfully:", response);
        // Remove the deleted event from the frontend
        this.myEvents = this.myEvents.filter(
          (event) => event.EventID !== eventId,
        );
      },
      error: (error) => {
        console.error("Error deleting event:", error);
      },
    });
  }
}
