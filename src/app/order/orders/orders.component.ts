import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  formModal: any;
  errMessage: string = '';
  orderToDelete: any;

  // sample data
  orders: any = [
    {
      id: 1,
      date: '2023-04-15',
      products: [
        { id: '1', name: 'Product1', quantity: 2 },
        { id: '2', name: 'Product 2', quantity: 1 },
        {
          id: '3',
          name: 'Product 3 loremProduct 3 loremProduct 3 lorem',
          quantity: 3,
        },
      ],
      total: 500,
      customer: 'John Doe',
      paymentMethod: 'Credit Card',
      status: 'completed',
    },
    {
      id: 'order01',
      date: '2023-04-16',
      paymentMethod: 'Credit Card',
      products: [
        { name: 'Product 2', quantity: 1 },
        { name: 'Product 4', quantity: 2 },
      ],
      total: 300,
      customerID: 'customer01',
      status: 'pending',
    },
    {
      id: 'order01',
      date: '2023-04-16',
      paymentMethod: 'Credit Card',
      products: [
        { name: 'Product 2', quantity: 1 },
        { name: 'Product 4', quantity: 2 },
      ],
      total: 300,
      customerID: 'customer01',
      status: 'dispatched',
      deliveryAddress: '1234 Main St, New York, NY 10001',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    // Use jQuery to initialize the Bootstrap tooltip
    $('[data-toggle="tooltip"]').tooltip();
  }
}
