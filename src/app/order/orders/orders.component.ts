import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { Router, RouterLink } from '@angular/router';
import { Order } from 'src/app/models/order';
import { AuthService } from 'src/app/services/auth.service';
import {
  faSearch,
  faSort,
  faSortDesc,
  faSortAsc,
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  faSearch = faSearch;
  faSort = faSort;
  faSortDesc = faSortDesc;
  faSortAsc = faSortAsc;

  orders: any;
  errMessage: string = '';
  orderToDelete: any;
  public saleProduct: any;
  public productId: string = '';
  public orderId: string = '';
  orderIdDelete: string = '';

  ngOnInit(): void {
    this.authService.checkValidUser();
    // Code to view all orders here
    this.getOrders();
    // console.log(this.getProduct(this.ProductId));
    console.log(this.orderId);
  }
  ngAfterViewInit(): void {}
  // Define pagination
  paginationConfig: PaginationInstance = {
    id: 'orders',
    itemsPerPage: 8,
    currentPage: 1,
  };

  onPageChange(pageNumber: number) {
    this.paginationConfig.currentPage = pageNumber;
  }
  //get orders
  getOrders() {
    this.service.getOrders().subscribe({
      next: (res: any) => {
        this.orders = res;
        console.log(this.orders);
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }

  constructor(
    private service: OrderService,
    private authService: AuthService,
    private Pservice: ProductService,
    private router: Router
  ) {}
  setOrderID(id: string) {
    this.orderId = id;
    console.log('Giá trị của orderID:', this.orderId);
  }

  ViewOrderDetail(id: string) {
    this.router.navigate(['order-edit/' + id]);
  }
  ViewCustomerDetail(id: string) {
    this.router.navigate(['customer-edit/' + id]);
  }

  currentSortState: string = 'default';
  sortASC() {
    this.currentSortState = 'asc';
    // WRITE CODE HERE
  }
  sortDESC() {
    this.currentSortState = 'desc';
    // WRITE CODE HERE
  }
  sortDefault() {
    this.currentSortState = 'default';
    // WRITE CODE HERE
  }
}
