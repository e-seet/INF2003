import { CommonModule } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { EventsService } from "../services/events.service";
import { UserService } from "../services/user.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";

@Component({
  selector: "app-organizer",
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    CommonModule, // for ngif ng for
  ],
  templateUrl: "./organizer.component.html",
  styleUrl: "./organizer.component.css",
})

// this page should showcase the events that i am hosting
export class OrganizerComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private eventService: EventsService,
    private userService: UserService, // Inject UserService
    private router: Router,
  ) {}

  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    // "EventID",
    "EventName",
    "EventDate",
    // "TicketPrice",
    "VenueName",
    "VenueLocation",
    // "Organizer",
  ];

  ngOnInit() {
    // this.loginService
    // get all my events by my id
    this.eventService.displayMyEvents().subscribe({
      next: (data: any) => {
        // console.log(data);

        var theobjects: any[] = [];
        data.forEach((item: any) => {
          //   console.log(item);
          theobjects.push({
            EventID: item.EventID,
            //   Organizer: item.Organization.OrganizationName,
            VenueName: item.Venue.VenueName,
            VenueLocation: item.Venue.Location,
            EventName: item.EventName,
            EventDate: item.EventDate,
            //   TicketPrice: item.TicketPrice,
          });
        });
        console.log("thedata");
        console.log(theobjects);
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

  // Method to handle row click and set the selected event
  onRowClick(event: any) {
    console.log("Event clicked:", event);
    // this.selectedEvent = event; // Save the clicked event to use in the button
    this.router.navigate([`/organizer`, event.EventID]);
  }

  // Method to handle button click and take further action
  handleButtonClick(event: any) {
    console.log("Button clicked for event:", event);
    console.log("this:", event.EventID);
    // Perform any action you want with the event, such as routing or displaying details
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
