import { Component } from '@angular/core';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css'],
})
export class OrderEditComponent {
  editable: boolean = false;
  toggleEdit() {
    this.editable = !this.editable;
  }

  // Sample data
  order: any = {
    id: 'O003',
    date: '2023-04-16',
    paymentMethod: 'Credit Card',
    products: [
      {
        id: 'P001',
        name: 'Oatmeal Sharkskin Slim Fit Suit',
        quantity: 1,
        specifications: 'Black, M',
      },
      {
        id: 'P002',
        name: 'Product 4',
        quantity: 2,
        specifications: 'White, M',
      },
    ],
    total: 300,
    customerID: 'C003',
    status: 'pending',
    deliveryAddress: '1234 Main St, New York, NY 10001',
  };

  constructor() {}

  onSave() {}

  goBack() {}
}
