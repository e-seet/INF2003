import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { LoginService } from "../services/login.service";
import { UserService } from "../services/user.service"; // Import UserService
import { CategoryService } from "../services/category.service";

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { EventsService } from "../services/events.service";

@Component({
  selector: "app-edit-event",
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    CommonModule, // for ngif ng for
  ],
  templateUrl: "./edit-event.component.html",
  styleUrl: "./edit-event.component.css",
})
export class EditEventComponent {
  constructor(
    private loginService: LoginService,
    private eventService: EventsService,
    private userService: UserService, // Inject UserService
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {}
  editForm!: FormGroup;

  myControl = new FormControl(); // Control for the mat-select
  options: string[] = [];
  selectedCategories: string[] = [];
  OrganizationID = null; // This will be set from the logged-in user's data

  successMessage: string = '';
  errorMessage: string = '';

  ngOnInit() {
    // Initialize form with validation
    this.editForm = this.fb.group({
      eventName: ["", Validators.required],
      eventDate: ["", Validators.required],
      venueName: ["", Validators.required],
      location: ["", Validators.required],
      capacity: ["", Validators.required],
      ticketPrice: ["", Validators.required],
      categories: this.myControl,
    });

    this.userService.getUserProfile().subscribe({
      next: (data) => {
        console.log("fetched user profile");
        console.log(data);

        this.OrganizationID = data.OrganizationID; // Set organizationID from user data
      },
      error: (error) => {
        // this.errorMessage = "Failed to load user data.";
        console.error("Error fetching user data:", error);
      },
    });
    
    this.categoryService.getCategory().subscribe({
      next: (data) => {
        data.forEach((category: { CategoryName: string }) => {
          this.options.push(category.CategoryName);
        });
      },
      error: (error) => {
        // this.errorMessage = "Failed to load user data.";
        console.error("Error fetching user data:", error);
      },
    });

    // Whenever the form control value changes, update the selected categories array
    this.myControl.valueChanges.subscribe((selectedValues) => {
      this.selectedCategories = selectedValues;
      //   console.log("Selected categories:", this.selectedCategories);
    });

    // Get event ID from the route and fetch event details
    var id = this.route.snapshot.paramMap.get("id");
    console.log(id);

    this.eventService.viewMyEventDetails(id).subscribe({
      next: (data: any) => {
        console.log("Received data:", data);

        // Format the date to "yyyy-MM-ddThh:mm" format
        const eventDate = new Date(data.EventDate);
        eventDate.setHours(eventDate.getHours() + 8); // Adjust to GMT+8
        const formattedDate = eventDate.toISOString().slice(0, 16);

        this.editForm.patchValue({
          eventName: data.EventName,
          eventDate: formattedDate,
          venueName: data.Venue?.VenueName,
          location: data.Venue?.Location,
          capacity: data.Venue?.Capacity,
          ticketPrice: data.TicketPrice,
          categories: data.Categories ? data.Categories.map((cat: any) => cat.CategoryName) : [],
        });
      },
      error: (error) => {
        this.errorMessage = "Failed to load event details.";
        console.error("Error loading event details:", error);
      }
    });
  }

  onSubmit() {
    console.log(this.selectedCategories);
    var eventId = this.route.snapshot.paramMap.get("id");
    let updatedEventData = {
      ...this.editForm.value,
      eventDate: new Date(this.editForm.value.eventDate),
      categories: this.selectedCategories,
      OrganizationID: this.OrganizationID,
    };
    // Call the service method to update the event
    this.eventService.updateEvent(eventId, updatedEventData).subscribe({
      next: () => {
        // Handle success response
        this.successMessage = "Event updated successfully!";
        this.errorMessage = ""; // Clear any previous error message
      },
      error: (error) => {
        // Handle error response
        this.errorMessage = "Failed to update event.";
        console.error("Error updating event:", error);
      },
    });
  }
}
