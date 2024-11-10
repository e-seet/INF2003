import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component"; // Import HomeComponent
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { EventListComponent } from "./event-list/event-list.component";
import { EventDetailsComponent } from "./event-details/event-details.component";
import { CreateEventComponent } from "./create-event/create-event.component";
import { SponsorsComponent } from "./sponsors/sponsors.component";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { OrderConfirmComponent } from "./order-confirm/order-confirm.component";
import { EventConfirmComponent } from "./event-confirm/event-confirm.component";
import { ProfileComponent } from "./profile/profile.component";
import { EditEventComponent } from "./edit-event/edit-event.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";
import { AuthGuard } from "./auth.guard";
import { TicketsComponent } from "./event/tickets/tickets.component";
import { TicketDetailComponent } from "./event/ticket-detail/ticket-detail.component";
import { EditTicketComponent } from "./edit-ticket/edit-ticket.component";
import { OrganizerComponent } from "./organizer/organizer.component";
import { OrganizerDetailsComponent } from "./organizer-details/organizer-details.component";

export const routes: Routes = [
  { path: "", component: HomeComponent }, // Set HomeComponent as the default route
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "events", component: EventListComponent },
  {
    path: "event/:id",
    component: EventDetailsComponent,
    canActivate: [AuthGuard],
  }, // Dynamic route for event details
  {
    path: "create-event",
    component: CreateEventComponent,
    canActivate: [AuthGuard],
  },
  { path: "sponsors", component: SponsorsComponent },
  //   { path: "dashboard", component: UserDashboardComponent },
  { path: "order-confirmation", component: OrderConfirmComponent },

  { path: "event-management/:id", component: EventConfirmComponent },
  { path: "event-confirm", component: EventConfirmComponent },

  {
    path: "organizer",
    component: OrganizerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "organizer/:id",
    component: OrganizerDetailsComponent,
    canActivate: [AuthGuard],
  },

  // for my Tickets. The tickets i brought for
  { path: "myticket", component: TicketsComponent, canActivate: [AuthGuard] },
  {
    path: "myticket/:id",
    component: TicketDetailComponent,
    canActivate: [AuthGuard],
  },
  { path: "edit-myticket/:id", component: EditTicketComponent, canActivate: [AuthGuard] },

  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: "edit-event/:id",
    component: EditEventComponent,
    canActivate: [AuthGuard],
  },
  { path: "contact-us", component: ContactUsComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  {
    path: "user-dashboard",
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
  },
  // any other routes to home
  { path: "**", redirectTo: "/home" },
  // Add other routes here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
