import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: any = [
    {
      id: 1,
      date: '2023-04-15',
      products: [
        { name: 'Product 1', quantity: 2 },
        { name: 'Product 2', quantity: 1 },
        { name: 'Product 3', quantity: 3 },
      ],
      total: 500,
      customer: 'John Doe',
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
      status: 'finished',
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
      status: 'finished',
      deliveryAddress: '1234 Main St, New York, NY 10001',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    // Use jQuery to initialize the Bootstrap tooltip
    $('[data-toggle="tooltip"]').tooltip();
  }
}
