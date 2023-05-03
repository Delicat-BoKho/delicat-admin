import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent {
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  modalRef: BsModalRef | null = null;

  errMessage: string = '';
  customerToDelete: any;

  // Define pagination
  paginationConfig: PaginationInstance = {
    id: 'customers',
    itemsPerPage: 8,
    currentPage: 1,
  };
  onPageChange(pageNumber: number) {
    this.paginationConfig.currentPage = pageNumber;
  }

  // Sample data
  customers = [
    {
      id: 1,
      username: 'jdoe',
      password: '123456',
      cart: [
        {
          id: 1,
          name: 'Customer 1',
          price: 100,
          quantity: 1,
        },
        {
          id: 2,
          name: 'Customer 2',
          price: 200,
          quantity: 2,
        },
      ],
      order: [],
      wishlist: [],
      fullName: 'John Doe',
      phone: '1234567890',
      email: 'jhon@doe.com ',
    },
  ];

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    // Code to view all customers here
  }

  confirmDeleteCustomer(customer: any): void {
    this.customerToDelete = customer;
    this.modalRef = this.modalService.show(this.deleteConfirmationModal, {
      class: 'modal-dialog-centered',
    });
  }

  deleteCustomer() {
    // Code to delete the customer here
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  cancelDeleteCustomer() {
    this.customerToDelete = null;
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}
