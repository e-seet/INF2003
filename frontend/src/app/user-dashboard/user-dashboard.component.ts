import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  imports: [CommonModule, RouterModule],
})
export class UserDashboardComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';

  // Add these missing properties
  upcomingEvents: any[] = []; // Initialize as an empty array or use a specific type for events
  myEvents: any[] = []; // Initialize as an empty array or use a specific type for events
  notifications: any[] = []; // Initialize as an empty array or use a specific type for notifications

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    // Extract user details from the JWT token
    const decodedToken = this.loginService.getDecodedToken();
    if (decodedToken) {
      this.userName = decodedToken.name;
      this.userEmail = decodedToken.email;
    } else {
      console.error('Failed to decode token or token is missing.');
    }

    //TEMP DATA
    this.upcomingEvents = [
      { id: 1, name: 'Event 1', date: new Date(), location: 'Location 1' },
      { id: 2, name: 'Event 2', date: new Date(), location: 'Location 2' },
    ];

    this.myEvents = [
      {
        id: 3,
        name: 'My Event 1',
        date: new Date(),
        location: 'My Location 1',
      },
    ];
  }

  // Define the deleteEvent method
  deleteEvent(eventId: number): void {
    console.log('Event deleted:', eventId);
    this.myEvents = this.myEvents.filter((event) => event.id !== eventId);
  }
}
