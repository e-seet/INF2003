import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EventsService } from '../services/events.service';
import { CommonModule } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css',
})
export class EventListComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private eventService: EventsService, private router: Router) {}

  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = [
    'EventID',
    'EventName',
    'EventDate',
    'TicketPrice',
    'VenueName',
    'VenueLocation',
    'Organizer',
  ];

  ngOnInit() {
    this.eventService.displayEvents().subscribe({
      next: (data) => {
        var theobjects: any[] = [];
        data.forEach((item: any) => {
          theobjects.push({
            EventID: item.EventID,
            EventName: item.EventName,
            EventDate: item.EventDate,
            TicketPrice: item.TicketPrice,
            VenueName: item.Venue.VenueName,
            VenueLocation: item.Venue.Location,
            Organizer: item.Organization.OrganizationName,
          });
        });
        this.dataSource.data = theobjects;
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Completed the call'); // Complete callback
      },
    });
  }
  
  // Method to handle row click and set the selected event
  onRowClick(event: any) {
    console.log('Event clicked:', event);
    // this.selectedEvent = event; // Save the clicked event to use in the button
    this.router.navigate([`/event`, event.EventID]);
  }

  // Method to handle button click and take further action
  handleButtonClick(event: any) {
    console.log('Button clicked for event:', event);
    console.log('this:', event.EventID);
    // Perform any action you want with the event, such as routing or displaying details
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
