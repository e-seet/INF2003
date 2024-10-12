import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { EventsService } from "../services/events.service";
import { UserService } from "../services/user.service"; // Import UserService
import { CategoryService } from "../services/category.service";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  standalone: true,
  selector: "app-create-event",
  templateUrl: "./create-event.component.html",
  styleUrls: ["./create-event.component.css"],
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule, // For <mat-form-field>
    MatSelectModule, // For <mat-select>
    ReactiveFormsModule, // I
  ],
})
export class CreateEventComponent implements OnInit {
  myControl = new FormControl(); // Control for the mat-select
  options: string[] = [];
  selectedCategories: string[] = [];

  event = {
    eventName: "",
    eventDate: "",
    ticketPrice: null,
    venueName: "", // Changed from venueID to venueName
    OrganizationID: null, // This will be set from the logged-in user's data
    Location: "",
    Capacity: null,
    categories: [] as string[],
  };

  errorMessage: string = "";
  successMessage: string = "";

  constructor(
    private eventService: EventsService,
    private userService: UserService, // Inject UserService
    private categoryService: CategoryService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // console.log("create event");
    // Fetch the logged-in user's data
    this.userService.getUserProfile().subscribe({
      next: (data) => {
        console.log("fetched user profiel");
        console.log(data);

        this.event.OrganizationID = data.OrganizationID; // Set organizationID from user data
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
  }

  onSubmit(): void {
    console.log("to submit");
    console.log(this.selectedCategories);

    this.event.categories = this.selectedCategories;

    console.log(this.event);
    this.eventService.createEvent(this.event).subscribe({
      next: () => {
        this.successMessage = "Event created successfully!";
        this.router.navigate(["/events"]); // Redirect to events list or another page
      },
      error: (error: any) => {
        this.errorMessage = "Failed to create event.";
        console.error("Error creating event:", error);
      },
    });
  }
}
