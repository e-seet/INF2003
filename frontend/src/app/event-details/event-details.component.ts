import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EventsService } from '../services/events.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';

import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [MatCardModule, MatGridListModule, MatButtonModule, CommonModule],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent {
	// eventId: number | null = null;
	event: any =
	{
		EventID: null,
		EventDate: null,
		TicketPrice: null,
		VenueName: '',
		VenueLocation: ''
	}

	constructor(
		private eventService: EventsService,
		private route: ActivatedRoute
		
	) {}

	ngOnInit() {
		var id = this.route.snapshot.paramMap.get('id');
		console.log(id)
		// this.eventId = id !== null ? parseInt(id, 10) : null;

		this.eventService.viewEventDetails(id).subscribe({
		  next: (data) => {

			this.event.EventName = data[0]["EventName"];
			this.event.EventID = data[0]["EventID"];
			this.event.EventDate= new Date(data[0]["EventDate"]);
			this.event.TicketPrice= data[0]["TicketPrice"];
			this.event.VenueName= data[0]["Venue"]["VenueName"];
			this.event.VenueLocation= data[0]["Venue"]["Location"];
			this.event.Organizer= data[0]["Organization"]["OrganizationName"];

		  },
		  error: (error) => {
			console.error('Error:', error);
		  },
		  complete: () => {
			console.log('Completed the call'); // Complete callback
		  },
		});
	  }
	
}
