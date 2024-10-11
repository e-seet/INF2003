import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { EventsService } from '../services/events.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  imports: [CommonModule, RouterModule],
  providers: [DatePipe],
})
export class UserDashboardComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';
  userId: number | null = null; // Make userId nullable
  upcomingEvents: any[] = [];
  myEvents: any[] = [];
  notifications: any[] = [];

  constructor(private loginService: LoginService, private eventService: EventsService) {}

  ngOnInit(): void {
    // Retrieve user ID from the JWT token and load profile
    this.userId = this.loginService.getUserIdFromToken();
    if (this.userId) {
      this.loadUserProfile(); // Load user data only if userId is valid
      this.loadUserEvents();
      this.loadUserNotifications();
    } else {
      console.error('User ID not found in token');
    }
  }

  // Load user profile information from the backend
  loadUserProfile() {
    if (this.userId) {
      this.loginService.getUserData(this.userId).subscribe({
        next: (userData) => {
          this.userName = userData.Name;
          this.userEmail = userData.Email;
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        }
      });
    }
  }

  // Load events created by the user
  loadUserEvents() {
    this.myEvents = [
      { id: 1, name: 'Event 1', date: new Date(), location: 'Location 1' },
      { id: 2, name: 'Event 2', date: new Date(), location: 'Location 2' }
    ];
  }

  // Load notifications
  loadUserNotifications() {
    this.notifications = [
      { message: 'Your event "Event 1" is happening soon!' },
      { message: 'New event "Event 3" created successfully.' }
    ];
  }

  // Method to delete an event
  deleteEvent(eventId: number): void {
    const eventIndex = this.myEvents.findIndex((event) => event.id === eventId);
    if (eventIndex > -1) {
      this.myEvents.splice(eventIndex, 1);
      console.log(`Event with ID ${eventId} deleted successfully.`);
    } else {
      console.warn(`Event with ID ${eventId} not found.`);
    }
  }
}
