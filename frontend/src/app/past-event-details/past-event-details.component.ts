import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { EventsService } from "../services/events.service";
import { LoginService } from "../services/login.service";
import { OrderConfirmService } from "../services/order-confirm.service";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";

import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatButtonModule } from "@angular/material/button";

import { DatePipe } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from "@angular/forms";
import { S3serviceService } from "../../services/s3service.service";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-past-event-details",
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: "./past-event-details.component.html",
  styleUrl: "./past-event-details.component.css",
})
export class PastEventDetailsComponent {
  event: any = {
    EventID: null,
    EventDate: null,
    TicketPrice: null,
    VenueName: "",
    VenueLocation: "",
  };

  blocking = 0;
  selectedFiles: File[] = []; // Array to hold multiple files

  selectedTicketType: string = "Standard"; //Default to Standard
  adjustedTicketPrice: number = 0; // Hold adjusted price
  sponsorshipAmount: number = 0; // Hold sponsorship amount
  userId: number | null = null; // To hold userID
  photoData: any[] = [];

  constructor(
    private eventService: EventsService,
    private orderConfirmService: OrderConfirmService,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private s3Service: S3serviceService,
    private fb: FormBuilder,
  ) {}
  editProfileForm!: FormGroup;
  ngOnInit() {
    var id = this.route.snapshot.paramMap.get("id");
    console.log(id);
    // this.eventId = id !== null ? parseInt(id, 10) : null;

    this.editProfileForm = this.fb.group({
      //   name: ["", Validators.required],
      //   email: ["", [Validators.required, Validators.email]],
      //   phone: [""],
      //   OrganizationName: [""],
      files: [[]], // Array to hold file URLs
    });

    this.eventService.viewEventDetails(id).subscribe({
      next: (data) => {
        console.log(data[0]);
        this.event.EventName = data[0]["EventName"] ?? "";
        this.event.EventID = data[0]["EventID"] ?? "";
        this.event.EventDate = new Date(data[0]["EventDate"]);
        this.event.TicketPrice = data[0]["TicketPrice"] ?? "";
        this.event.VenueName = data[0]["Venue"]["VenueName"] ?? "";
        this.event.VenueLocation = data[0]["Venue"]["Location"] ?? "";
        this.event.Organizer =
          data[0]?.["Organization"]?.["OrganizationName"] ?? "";
        this.event.Host = data[0]?.["User"]?.["Name"];
        // this.adjustTicketPrice(); // Adjust price when data is loaded
      },
      error: (error) => {
        console.error("Error:", error);
      },
      complete: () => {
        console.log("Completed the call"); // Complete callback
      },
    });

    // Retrieve the user ID from the JWT token
    // this.userId = this.loginService.getUserIdFromToken();
    this.userId = this.loginService.getDecodedAccessToken(
      this.loginService.getToken(),
    );
    console.log("User ID from token:", this.userId);

    this.eventService.getMongoDBPhoto(id).subscribe({
      next: (data) => {
        console.log("\n\n");
        console.log("data");
        console.log(data.data[0].Photos);
        if (data?.data?.length > 0 && Array.isArray(data.data[0].Photos)) {
          this.photoData = data.data[0].Photos; // Assign Photos if it exists
        } else {
          console.error("No photos found or invalid response structure.");
        }
      },
      error: (error) => {
        console.error("Error:", error);
      },
      complete: () => {
        console.log("Completed the call"); // Complete callback
      },
    });
  }

  // Method to adjust the ticket price
  //   adjustTicketPrice() {
  //     switch (this.selectedTicketType) {
  //       case "Premium":
  //         this.adjustedTicketPrice = parseFloat(
  //           (this.event.TicketPrice * 1.5).toFixed(2),
  //         ); // 2 d.p.
  //         break;
  //       case "VIP":
  //         this.adjustedTicketPrice = parseFloat(
  //           (this.event.TicketPrice * 2).toFixed(2),
  //         );
  //         break;
  //       default:
  //         this.adjustedTicketPrice = this.event.TicketPrice;
  //     }
  //   }

  // Method to buy ticket
  //   buyTicket() {
  //     if (!this.userId) {
  //       alert("User is not logged in");
  //       return;
  //     }

  //     const eventData = {
  //       UserID: this.userId,
  //       EventID: this.event.EventID,
  //       TicketType: this.selectedTicketType,
  //       PurchaseDate: new Date(),
  //     };

  //     this.eventService.purchaseTicket(eventData).subscribe({
  //       next: (response) => {
  //         console.log("Ticket purchased successfully", response);
  //         // Store order details in the OrderConfirmService
  //         this.orderConfirmService.setOrderData({
  //           eventDate: this.event.EventDate,
  //           eventName: this.event.EventName,
  //           venue: this.event.VenueName,
  //           ticketType: this.selectedTicketType,
  //           total: this.adjustedTicketPrice,
  //         });
  //         // Redirect to /order-confirmation page
  //         this.router.navigate(["/order-confirmation"], {});
  //       },
  //       error: (error) => {
  //         console.error("Error purchasing ticket:", error);
  //         alert(
  //           "Error: You are permitted to purchase only one ticket per event listed. Please use the dashboard to modify the ticket.",
  //         );
  //       },
  //     });
  //   }

  // Method to handle sponsorship
  //   sponsorEvent() {
  //     if (!this.userId || !this.sponsorshipAmount) {
  //       alert("Please enter a sponsorship amount.");
  //       return;
  //     }

  //     const sponsorData = {
  //       UserID: this.userId,
  //       EventID: this.event.EventID,
  //       SponsorshipAmount: this.sponsorshipAmount,
  //     };

  //     this.eventService.submitSponsorship(sponsorData).subscribe({
  //       next: (response) => {
  //         alert("Sponsorship submitted successfully!");
  //         console.log("Sponsorship response:", response);
  //       },
  //       error: (error) => {
  //         alert(
  //           "Error: You are permitted to sponsor only once per event listed. Please use the dashboard to modify the sponsorship amount.",
  //         );
  //         console.error("Error:", error);
  //       },
  //     });
  //   }

  // Handler for file input change (for multiple files)
  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const newFiles = Array.from(input.files); // Convert FileList to array
      // Append new files to the existing selectedFiles array
      this.selectedFiles = [...this.selectedFiles, ...newFiles];
      console.log("Selected files:", this.selectedFiles);
    }
  }

  // Remove a file from the list
  removeFile(index: number): void {
    // Remove the file from the selected files list
    const removedFile = this.selectedFiles.splice(index, 1)[0];

    // Update the form value
    const updatedFileUrls = this.editProfileForm.value.files.filter(
      (url: string) => !url.includes(removedFile.name),
    );

    this.editProfileForm.patchValue({
      files: updatedFileUrls,
    });

    console.log("Remaining files after removal:", this.selectedFiles);
    // this.selectedFiles.splice(index, 1); // Remove the file at the given index
    // console.log("Remaining files after removal:", this.selectedFiles);
  }

  onUpload(): void {
    this.blocking = 1;
    const uploadedFiles: string[] = [];

    const uploadPromises = this.selectedFiles.map((file) =>
      this.s3Service
        .uploadFile(file)
        .then((response) => {
          console.log("File uploaded successfully:", response.location);
          uploadedFiles.push(response.location); // Add URL to the temporary array
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        }),
    );

    // Wait for all uploads to finish
    Promise.all(uploadPromises)
      .then(() => {
        this.editProfileForm.patchValue({
          files: uploadedFiles, // Update the form with the array of URLs
        });
        this.blocking = 0;
        console.log("All files uploaded successfully:", uploadedFiles);
      })
      .catch((error) => {
        console.error("Error in uploading files:", error);
        this.blocking = 0;
      });
    // this.selectedFiles.forEach((file) => {
    //   this.s3Service
    //     .uploadFile(file)
    //     .then((response) => {
    //       console.log("File uploaded successfully:", response.location);
    //       this.editProfileForm.patchValue({
    //         file: response.location,
    //       });

    //       this.blocking = 0;
    //     })
    //     .catch((error) => {
    //       console.error("Error uploading file:", error);
    //       this.blocking = 0;
    //     });
    // });
  }

  onSubmit(): void {
    console.log("onsubmit\n");
    if (this.blocking == 0) {
      console.log("Form Submitted", this.editProfileForm.value);

      // let profileData = this.editProfileForm.value;
      let temptoken = this.loginService.getDecodedAccessToken(
        this.loginService.getToken(),
      );
      //   console.log(temptoken);
      let profileData = {
        EventId: this.event.EventID,
        userID: temptoken.userID,
        userName: temptoken.name,
        Photourl: this.editProfileForm.value,
      };
      console.log(profileData);

      this.eventService.savetoMongoDBPhotos(profileData).subscribe({
        next: (data: any) => {
          console.log(data);
        },
        error: (error: any) => {
          console.error("Error:", error);
        },
        complete: () => {
          console.log("Completed the call"); // Complete callback
          this.router.navigate(["/user-dashboard"]);
        },
      });
    } else {
      console.log("Form is invalid");
    }
  }
}
