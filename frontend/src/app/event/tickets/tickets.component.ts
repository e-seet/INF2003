import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { LoginService } from "../../services/login.service";
import { EventsService } from "../../services/events.service";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { Router } from "@angular/router";

@Component({
  selector: "app-tickets",
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule, // For <mat-form-field>
    MatSelectModule, // For <mat-select>
    ReactiveFormsModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
  ],
  templateUrl: "./tickets.component.html",
  styleUrl: "./tickets.component.css",
})
export class TicketsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public httpClient: HttpClient,
    private loginService: LoginService,
    private eventService: EventsService,
    private router: Router,
  ) {}

  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    "EventID",
    "EventName",
    "PurchaseDate",
    "TicketType",
    "TicketPrice",
    "EventDate",
    "VenueName",
    "VenueLocation",
    "Organizer",
  ];
  TicketType: string = '';
  TicketPrice: number = 0;
  adjustedTicketPrice: number = 0; // Hold adjusted price

  ngOnInit(): void {
    // get all my tickets
    this.eventService.getTickets().subscribe({
      next: (data) => {
        var theobjects: any[] = [];
        data.forEach((item: any) => {
          const ticketPrice = item.Event.TicketPrice;
          const ticketType = item.TicketType;
          // Use the method to calculate adjusted price
          const adjustedTicketPrice = this.adjustTicketPrice(ticketType, ticketPrice);
          theobjects.push({
            UserID: item.UserID,
            EventID: item.EventID,
            TicketType: item.TicketType,
            PurchaseDate: item.PurchaseDate,
            Organizer: item.Event.Organization.OrganizationName,
            VenueName: item.Event.Venue.VenueName,
            VenueLocation: item.Event.Venue.Location,
            EventName: item.Event.EventName,
            EventDate: item.Event.EventDate,
            TicketPrice: adjustedTicketPrice,
          });
        });
        this.dataSource.data = theobjects;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error("Error:", error);
      },
      complete: () => {
        console.log("Completed the call"); // Complete callback
      },
    });
  }

  // Method to adjust ticket price
  adjustTicketPrice(ticketType: string, ticketPrice: number): number {
    switch (ticketType) {
      case "Premium":
        return parseFloat((ticketPrice * 1.5).toFixed(2));
      case "VIP":
        return parseFloat((ticketPrice * 2).toFixed(2));
      default:
        return ticketPrice;
    }
  }

  // Method to handle row click and set the selected ticket
  onRowClick(event: any) {
    console.log("Ticket clicked:", event);
    this.router.navigate(['/myticket', event.UserID, event.EventID]);
  }

  // Method to handle button click and take further action
  handleButtonClick(event: any) {
    console.log("Button clicked for event:", event);
    console.log("this:", event.UserID, event.EventID);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
