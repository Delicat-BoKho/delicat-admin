import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  modalRef: BsModalRef | null = null;

  errMessage: string = '';
  orderToDelete: any;

  // Define pagination
  paginationConfig: PaginationInstance = {
    id: 'orders',
    itemsPerPage: 8,
    currentPage: 1,
  };
  onPageChange(pageNumber: number) {
    this.paginationConfig.currentPage = pageNumber;
  }

  // Sample data
  orders: any = [
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
    {
      id: 'O001',
      date: '2023-04-16',
      paymentMethod: 'Credit Card',
      products: [
        { name: 'Product 2', quantity: 1 },
        { name: 'Product 4', quantity: 2 },
      ],
      total: 300,
      customerID: 'C002',
      status: 'pending',
    },
    {
      id: 'O002',
      date: '2023-04-16',
      paymentMethod: 'Credit Card',
      products: [
        { name: 'Product 2', quantity: 1 },
        { name: 'Product 4', quantity: 2 },
      ],
      total: 300,
      customerID: 'C003',
      status: 'dispatched',
      deliveryAddress: '1234 Main St, New York, NY 10001',
    },
    {
      id: 'O003',
      date: '2023-04-16',
      paymentMethod: 'Credit Card',
      products: [
        { name: 'Product 2', quantity: 1 },
        { name: 'Product 4', quantity: 2 },
      ],
      total: 300,
      customerID: 'C003',
      status: 'unknown',
      deliveryAddress: '1234 Main St, New York, NY 10001',
    },
  ];

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    // Code to view all orders here
  }

  confirmDeleteOrder(order: any): void {
    this.orderToDelete = order;
    this.modalRef = this.modalService.show(this.deleteConfirmationModal, {
      class: 'modal-dialog-centered',
    });
  }

  deleteOrder() {
    // Code to delete the order here
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  cancelDeleteOrder() {
    this.orderToDelete = null;
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}
