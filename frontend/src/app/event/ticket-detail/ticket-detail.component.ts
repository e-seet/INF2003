import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { LoginService } from "../../services/login.service";
import { EventsService } from "../../services/events.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-ticket-detail",
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule, // For <mat-form-field>
    MatSelectModule, // For <mat-select>
    ReactiveFormsModule, // I
  ],
  templateUrl: "./ticket-detail.component.html",
  styleUrl: "./ticket-detail.component.css",
})
export class TicketDetailComponent {
  constructor(
    public httpClient: HttpClient,
    private loginService: LoginService,
    private eventService: EventsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // get all my tickets
    var id = this.route.snapshot.paramMap.get("id");

    this.eventService.viewEventDetails(id).subscribe({
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
