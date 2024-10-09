import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [FormsModule, CommonModule]
})
export class CartComponent {
  // Mocked cart items
  cartItems: { eventName: string; ticketQuantity: number; price: number; }[] = [
    { eventName: 'Event A', ticketQuantity: 2, price: 50 },
    { eventName: 'Event B', ticketQuantity: 3, price: 35 }
  ];

  // Total cost of the cart
  totalCost: number = this.calculateTotalCost();

  constructor(private router: Router) {}

  // Method to remove an item from the cart
  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    this.totalCost = this.calculateTotalCost(); // Recalculate total cost
  }

  // Method to update the ticket quantity
  updateQuantity(index: number, quantity: number) {
    if (quantity < 1) {
      quantity = 1; // Minimum 1 ticket
    }
    this.cartItems[index].ticketQuantity = quantity;
    this.totalCost = this.calculateTotalCost(); // Recalculate total cost
  }

  // Calculate total cost
  calculateTotalCost(): number {
    return this.cartItems.reduce((total, item) => total + (item.ticketQuantity * item.price), 0);
  }

  // Method for order confirmation
  OrderConfirm() {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert(`Proceeding to checkout. Total cost: $${this.totalCost}`);
    this.router.navigate(['/order-confirm']); // Redirect to order confirm page
  }
}
