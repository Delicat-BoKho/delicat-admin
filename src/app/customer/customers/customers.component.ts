import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaginationInstance } from 'ngx-pagination';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from 'src/app/services/auth.service';
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
  customerTemp: any;
  deleteCustomerId: string = '';
  searchCustomer: string = '';
  foundCustomers: Customer[] = [];
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
    private authService: AuthService,
    private fireStorage: AngularFireStorage,
    private router: Router
  ) {}
  search() {
    this.foundCustomers = [];
    for (let i = 0; i < this.customerTemp.length; i++) {
      const customer = this.customerTemp[i];
      if (
        customer.userName
          .toLowerCase()
          .includes(this.searchCustomer.toLowerCase()) ||
        customer.phone
          .toLowerCase()
          .includes(this.searchCustomer.toLowerCase()) ||
        customer.fullName
          .toLowerCase()
          .includes(this.searchCustomer.toLowerCase())
      ) {
        this.foundCustomers.push(customer);
      }
    }
    this.customers = this.foundCustomers;
  }
  ngOnInit(): void {
    // Code to view all customers here
    this.authService.checkValidUser();
    this.getCustomers();
  }
  //
  getCustomers() {
    this.service.getCustomers().subscribe({
      next: (res: any) => {
        this.customerTemp = res;
        this.customers = this.customerTemp;
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
