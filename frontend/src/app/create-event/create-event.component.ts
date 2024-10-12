import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventsService } from '../services/events.service';
import { UserService } from '../services/user.service'; // Import UserService

@Component({
  standalone: true,
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
  imports: [FormsModule, CommonModule]
})
export class CreateEventComponent implements OnInit {
  event = {
    eventName: '',
    eventDate: '',
    ticketPrice: null,
    venueName: '', // Changed from venueID to venueName
    organizationID: null // This will be set from the logged-in user's data
  };
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private eventService: EventsService,
    private userService: UserService, // Inject UserService
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch the logged-in user's data
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.event.organizationID = data.organizationID; // Set organizationID from user data
      },
      error: (error) => {
        this.errorMessage = 'Failed to load user data.';
        console.error('Error fetching user data:', error);
      }
    });
  }

  onSubmit(): void {
    this.eventService.createEvent(this.event).subscribe({
      next: () => {
        this.successMessage = 'Event created successfully!';
        this.router.navigate(['/events']); // Redirect to events list or another page
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to create event.';
        console.error('Error creating event:', error);
      }
    });
  }
}