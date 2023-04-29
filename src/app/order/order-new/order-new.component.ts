import { Component } from '@angular/core';
@Component({
  selector: 'app-order-new',
  templateUrl: './order-new.component.html',
  styleUrls: ['./order-new.component.css'],
})
export class OrderNewComponent {
  order = {
    id: '',
    customerID: '',
    date: '',
    paymentMethod: '',
    status: '',
    deliveryAddress: '',
    total: '',
    products: [
      { id: '', name: '', specifications: '', quantity: 0 },
      { id: '', name: '', specifications: '', quantity: 0 },
      { id: '', name: '', specifications: '', quantity: 0 },
      { id: '', name: '', specifications: '', quantity: 0 },
      { id: '', name: '', specifications: '', quantity: 0 },
      { id: '', name: '', specifications: '', quantity: 0 },
      { id: '', name: '', specifications: '', quantity: 0 },
      { id: '', name: '', specifications: '', quantity: 0 },
      { id: '', name: '', specifications: '', quantity: 0 },
      { id: '', name: '', specifications: '', quantity: 0 },
    ],
  };

  constructor() {}
  createOrder() {}
  goBack() {}
}
