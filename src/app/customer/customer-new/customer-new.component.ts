import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-customer-new',
  templateUrl: './customer-new.component.html',
  styleUrls: ['./customer-new.component.css'],
})
export class CustomerNewComponent {
  showPassword: boolean = false;
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  // Sample data
  customer: any = {
    id: 'C001',
    username: 'jdoe',
    password: '123456',
    cart: [
      {
        id: 'P001',
      },
      {
        id: 'P001',
      },
    ],
    order: [
      {
        id: 'O000',
        date: '2023-04-15',
        products: [
          { id: '1', name: 'Product1', quantity: 2 },
          { id: '2', name: 'Product 2', quantity: 1 },
          {
            id: 'S301',
            name: 'Oatmeal Sharkskin Slim Fit Suit',
            quantity: 3,
          },
        ],
        total: 500,
        customerID: 'C001',
        paymentMethod: 'Cash',
        status: '',
      },
      {
        id: 'O000',
        date: '2023-04-15',
        products: [
          { id: '1', name: 'Product1', quantity: 2 },
          { id: '2', name: 'Product 2', quantity: 1 },
          {
            id: 'S301',
            name: 'Oatmeal Sharkskin Slim Fit Suit',
            quantity: 3,
          },
        ],
        total: 500,
        customerID: 'C001',
        paymentMethod: 'Cash',
        status: 'completed',
      },
    ],
    wishlist: [
      {
        id: 'P001',
      },
    ],
    fullName: 'John Doe',
    phone: '0123456789',
    address: '123 Main St',
  };

  constructor(private location: Location) {}

  onSave() {}
  goBack(): void {
    this.location.back();
  }
}
