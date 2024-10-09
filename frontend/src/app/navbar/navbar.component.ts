import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for NgIf
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true, // Mark this component as standalone
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, RouterModule] // Add CommonModule to imports
})
export class NavbarComponent {
  isLoggedIn: boolean = false; // This will control the Login/Logout button state

  // Method to handle login action
  login() {
    this.isLoggedIn = true;
  }

  // Method to handle logout action
  logout() {
    this.isLoggedIn = false;
  }
}