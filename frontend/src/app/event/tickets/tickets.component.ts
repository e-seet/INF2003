import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { LoginService } from "../../services/login.service";
import { EventsService } from "../../services/events.service";
@Component({
  selector: "app-tickets",
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule, // For <mat-form-field>
    MatSelectModule, // For <mat-select>
    ReactiveFormsModule, // I
  ],
  templateUrl: "./tickets.component.html",
  styleUrl: "./tickets.component.css",
})
export class TicketsComponent {
  constructor(
    public httpClient: HttpClient,
    private loginService: LoginService,
    private eventService: EventsService,
  ) {}

  ngOnInit(): void {
    // get all my tickets
    this.eventService.getTickets().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.error("Error:", error);
      },
      complete: () => {
        console.log("Completed the call"); // Complete callback
      },
    });
  }
}
