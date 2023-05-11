import { Component } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { Router } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from 'src/app/services/auth.service';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent {
  faSearch = faSearch;
  faXmark = faXmark;
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
          .includes(this.searchCustomer.toLowerCase()) ||
        customer.id.toLowerCase().includes(this.searchCustomer.toLowerCase())
      ) {
        this.foundCustomers.push(customer);
      }
    }
    this.customers = this.foundCustomers;
  }
  back() {
    this.searchCustomer = '';
    this.customers = this.customerTemp;
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

  viewDetailCustomer(id: string) {
    this.router.navigate(['customer-edit/' + id]);
  }
}
