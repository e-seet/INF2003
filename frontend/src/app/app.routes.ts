import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component'; // Import HomeComponent
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { SponsorComponent } from './sponsor/sponsor.component';
import { CartComponent } from './cart/cart.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { OrderConfirmComponent } from './order-confirm/order-confirm.component';
import { EventConfirmComponent } from './event-confirm/event-confirm.component';
import { ProfileComponent } from './profile/profile.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Set HomeComponent as the default route
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'events', component: EventListComponent },
  { path: 'event/:id', component: EventDetailsComponent }, // Dynamic route for event details
  { path: 'create-event', component: CreateEventComponent },
  { path: 'sponsor', component: SponsorComponent },
  { path: 'cart', component: CartComponent },
  { path: 'dashboard', component: UserDashboardComponent },
  { path: 'order-confirmation', component: OrderConfirmComponent },
  { path: 'event-management/:id', component: EventConfirmComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent }
  // Add other routes here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
