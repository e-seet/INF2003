import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { EventsService } from "../services/events.service";
import { CommonModule } from "@angular/common";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { Router } from "@angular/router";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; 
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: "app-event-list",
  standalone: true,
  imports: [
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
    MatOptionModule
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
  originalData: any[] = [];  // Keep a copy of the original data

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
  priceSortOrder: string = 'asc'; // Variable to track price sorting order

  ngOnInit() {
    this.eventService.displayEvents().subscribe({
      next: (data) => {
        var theobjects: any[] = [];
        data.forEach((item: any) => {
          theobjects.push({
            EventID: item.EventID,
            Organizer: item.Organization.OrganizationName,
            VenueName: item.Venue.VenueName,
            VenueLocation: item.Venue.Location,
            EventName: item.EventName,
            EventDate: item.EventDate,
            TicketPrice: item.TicketPrice,
          });
        });
        this.originalData = theobjects;  // Store the original data
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
  applyFilter() {
    const filteredData = this.originalData.filter((event: any) => {
      const eventDate = new Date(event.EventDate);
      if (this.startDate && eventDate < this.startDate) {
        return false;
      }
      if (this.endDate && eventDate > this.endDate) {
        return false;
      }
      return true;
    });

    // Sort the filtered data by price
    if (this.priceSortOrder === 'asc') {
      filteredData.sort((a, b) => a.TicketPrice - b.TicketPrice);
    } else if (this.priceSortOrder === 'desc') {
      filteredData.sort((a, b) => b.TicketPrice - a.TicketPrice);
    }

    this.dataSource.data = filteredData;
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
}
