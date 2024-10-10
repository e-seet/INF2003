import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderConfirmService } from '../services/order-confirm.service';

@Component({
  selector: 'app-order-confirm',
  standalone: true,
  imports: [],
  templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.css']
})
export class OrderConfirmComponent {
  eventDate: Date | null = null;
  eventName: string | null = null;
  venue: string | null = null;
  ticketType: string | null = null;
  total: number | null = null;

  constructor(
    private route: ActivatedRoute, 
    private orderConfirmService: OrderConfirmService
  ) {}

  ngOnInit() {
    const orderData = this.orderConfirmService.getOrderData();
    if (orderData) {
      this.eventDate = orderData.eventDate;
      this.eventName = orderData.eventName;
      this.venue = orderData.venue;
      this.ticketType = orderData.ticketType;
      this.total = orderData.total;
    }
  }
}
