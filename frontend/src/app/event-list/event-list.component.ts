import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { EventsService } from "../services/events.service";
import { CommonModule } from "@angular/common";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { Router } from "@angular/router";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-event-list",
  standalone: true,
  imports: [
    MatButton,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: "./event-list.component.html",
  styleUrl: "./event-list.component.css",
})
export class EventListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private eventService: EventsService,
    private router: Router,
  ) {}

  dataSource = new MatTableDataSource<any>();
  originalData: any[] = []; // Keep a copy of the original data
  currentEvents: any[] = [];
  pastEvents: any[] = [];
  showCurrentEvents = true; // Boolean to toggle between current and past events
  currentView: "Current" | "Past" | "All" = "All";

  displayedColumns: string[] = [
    "EventID",
    "EventName",
    "EventDate",
    "TicketPrice",
    "VenueName",
    "VenueLocation",
    "Organizer",
  ];

  startDate: Date | null = null;
  endDate: Date | null = null;
  priceSortOrder: string = "asc"; // Variable to track price sorting order

  toggleView() {
    this.showCurrentEvents = !this.showCurrentEvents;

    if (this.showCurrentEvents) {
      const now = new Date();
      this.dataSource.data = this.originalData.filter(
        (event) => new Date(event.EventDate) >= now,
      );
    } else {
      const now = new Date();
      this.dataSource.data = this.originalData.filter(
        (event) => new Date(event.EventDate) < now,
      );
    }
  }

  ngOnInit() {
    this.eventService.displayEvents().subscribe({
      next: (data) => {
        var theobjects: any[] = [];
        data.forEach((item: any) => {
          console.log(item);
          theobjects.push({
            EventID: item.EventID,
            Organizer: item.Organization?.OrganizationName
              ? item.Organization.OrganizationName
              : "N/A", // Check if Organization and OrganizationName exist
            VenueName: item.Venue.VenueName,
            VenueLocation: item.Venue.Location,
            EventName: item.EventName,
            EventDate: item.EventDate,
            TicketPrice: item.TicketPrice,
          });
        });
        this.originalData = theobjects; // Store the original data
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

  // Filtering logic based on startDate and endDate
  // original
  //   applyFilter() {
  //     const filteredData = this.originalData.filter((event: any) => {
  //       const eventDate = new Date(event.EventDate);
  //       if (this.startDate && eventDate < this.startDate) {
  //         return false;
  //       }
  //       if (this.endDate && eventDate > this.endDate) {
  //         return false;
  //       }
  //       return true;
  //     });

  //     // Sort the filtered data by price
  //     if (this.priceSortOrder === "asc") {
  //       filteredData.sort((a, b) => a.TicketPrice - b.TicketPrice);
  //     } else if (this.priceSortOrder === "desc") {
  //       filteredData.sort((a, b) => b.TicketPrice - a.TicketPrice);
  //     }

  //     this.dataSource.data = filteredData;
  //   }

  // new version
  applyFilter() {
    const startTime = performance.now(); // Start timing

    this.eventService
      .getFilteredEvents(this.startDate, this.endDate, this.priceSortOrder)
      .subscribe({
        next: (filteredData) => {
          this.dataSource.data = filteredData; // Update the table with filtered results
          const endTime = performance.now(); // End timing
          //   console.log(`Server-side filtering took ${endTime - startTime} ms`);
          console.log(`Filtering took ${endTime - startTime} ms`);
        },
        error: (error) => {
          console.error("Error fetching filtered events:", error);
        },
      });
  }

  // Method to handle row click and set the selected event
  onRowClick(event: any) {
    console.log("Event clicked:", event);
    // this.selectedEvent = event; // Save the clicked event to use in the button
    this.router.navigate([`/event`, event.EventID]);
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

  // Filter logic for past and current events
  applyFilterDate() {
    const now = new Date();

    this.currentEvents = this.originalData.filter(
      (event) => new Date(event.EventDate) >= now,
    );
    this.pastEvents = this.originalData.filter(
      (event) => new Date(event.EventDate) < now,
    );

    // Set the dataSource based on the toggle (current or past events)
    this.dataSource.data = this.showCurrentEvents
      ? this.currentEvents
      : this.pastEvents;
  }

  // Function to reset all filters and show original data
  resetFilters() {
    // Clear filters
    this.startDate = null;
    this.endDate = null;
    // this.priceSortOrder = null;
    // this.showCurrentEvents = true; // Reset to show current events

    this.currentView = "All";
    // Reset dataSource to original data
    this.dataSource.data = this.originalData;
  }

  // Function to toggle between current and past events
  toggleViewDate() {
    this.showCurrentEvents = !this.showCurrentEvents;
    if (this.showCurrentEvents) {
      this.currentView = "Current";
    } else {
      this.currentView = "Past";
    }
    this.applyFilterDate(); // Reapply the filter based on the new view
  }
}
