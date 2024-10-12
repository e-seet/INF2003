import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
  isLoggedIn: boolean = false; // Default to not logged in

  // Method to simulate login
  login() {
    this.isLoggedIn = true;
  }

  // Method to simulate logout
  logout() {
    this.isLoggedIn = false;
  }
}
