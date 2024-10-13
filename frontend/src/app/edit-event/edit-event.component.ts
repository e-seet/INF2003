import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { LoginService } from "../services/login.service";
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
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {}
  editForm!: FormGroup;

  ngOnInit() {
    this.editForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: [""],
      OrganizationName: [""],
      file: [""],
    });

    //get data back
    var id = this.route.snapshot.paramMap.get("id");

    this.eventService.viewMyEventDetails(id).subscribe({
      next: (data: any) => {
        console.log("data bakc");
        console.log(data);
        // this.editForm.patchValue({
        //   name: data.Name,
        //   email: data.Email,
        //   phone: data.Phone,
        //   OrganizationName: data.Organization.OrganizationName,
        // });
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
