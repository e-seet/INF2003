import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OrderConfirmService {
  private orderData: any = null;

  setOrderData(data: any) {
    this.orderData = data;
  }

  getOrderData() {
    return this.orderData;
  }

  constructor() {}
}
