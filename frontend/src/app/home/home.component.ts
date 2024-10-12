import { Component } from '@angular/core';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private eventService: EventsService) {} // Inject AuthService

  buttonToTS() {
    console.log('pressed at .ts \n');

    // varaible, object
    this.eventService.displayVenue().subscribe({
      next: (data) => {
        // Success callback
        console.log('Data:', data);
      },
      error: (error) => {
        // Error callback
        console.error('Error:', error);
      },
      complete: () => {
        //completed
        console.log('Completed the call'); // Complete callback
      },
    });
  }
}
