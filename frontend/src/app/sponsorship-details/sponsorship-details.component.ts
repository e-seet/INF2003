import { ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { UserService } from "../services/user.service";

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
  selector: 'app-sponsorship-details',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    CommonModule, // for ngif ng for
    MatCardModule,
    MatGridListModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './sponsorship-details.component.html',
  styleUrl: './sponsorship-details.component.css'
})
export class SponsorshipDetailsComponent {
  userId: number | null = null; // To hold userID
  event: any = {
    EventID: null,
    EventDate: null,
    TicketPrice: null,
    VenueName: "",
    VenueLocation: "",
    SponsorLevel: "",
  };

  eventSponsor: any[] = [];
  constructor(
    private eventService: EventsService,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
  ) {}

  ngOnInit() {
    var id = this.route.snapshot.paramMap.get("id");
    console.log("my id" + id);
    // this.eventId = id !== null ? parseInt(id, 10) : null;

    this.eventService.viewSponsorDetails(id).subscribe({
      next: (data) => {
        console.log(data);
        // Safely access data properties with optional chaining and fallback to "" or "N/A"
        this.event.EventName = data[0]?.["EventName"] ?? "";
        this.event.EventID = data[0]?.["EventID"] ?? "";
        this.event.EventDate = data[0]?.["EventDate"]
          ? new Date(data[0]["EventDate"])
          : "";
        this.event.TicketPrice = data[0]?.["TicketPrice"] ?? "";
        this.event.VenueName = data[0]?.["Venue"]?.["VenueName"] ?? "";
        this.event.VenueLocation = data[0]?.["Venue"]?.["Location"] ?? "";
        this.event.Host = data[0]?.["User"]?.["Name"];
        this.event.Organizer =
          data[0]?.["Organization"]?.["OrganizationName"] ?? "";
        this.eventSponsor = data[0]?.["EventSponsors"] ?? []; // Fallback to an empty array if EventSponsors is null or undefined

        console.log("Populated event object:", this.event);
      },
      error: (error) => {
        console.error("Error:", error);
      },
      complete: () => {},
    });

    // Retrieve the user ID from the JWT token
    // this.userId = this.loginService.getUserIdFromToken();
    this.userId = this.loginService.getDecodedAccessToken(
      this.loginService.getToken(),
    );
    console.log("User ID from token:", this.userId);
  }

  goBack() {
    this.router.navigate(["/sponsorship"]); // Redirect to events list or another page
  }
}
