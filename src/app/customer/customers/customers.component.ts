import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaginationInstance } from 'ngx-pagination';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent {
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  modalRef: BsModalRef | null = null;
  errMessage: string = '';
  customers: any;
  deleteCustomerId: string = '';
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

  constructor(
    private modalService: BsModalService,
    private service: CustomerService,
    private fireStorage: AngularFireStorage,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Code to view all customers here
    this.getCustomers();
  }
  //
  getCustomers() {
    this.service.getCustomers().subscribe({
      next: (res: any) => {
        this.customers = res;
        console.log(this.customers);
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }
  confirmDeleteCustomer(customer: any): void {
    this.deleteCustomerId = customer.id;
    this.modalRef = this.modalService.show(this.deleteConfirmationModal, {
      class: 'modal-dialog-centered',
    });
  }

  deleteCustomer() {
    this.service.deleteCustomer(this.deleteCustomerId);
    // Code to delete the customer here
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
  viewDetailCustomer(id: string) {
    this.router.navigate(['customer-edit/' + id]);
  }
  cancelDeleteCustomer() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}
