import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { Router, RouterLink } from '@angular/router';
import { Order } from 'src/app/models/order';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  ordersTemp: Order[] = [];

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
        this.ordersTemp = res;
        console.log(this.orders);
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }
  sortAscending: boolean = true;
  sortOrdersByTotal() {
    // Sử dụng phương thức sort() để sắp xếp các sản phẩm theo giá
    this.orders.sort((a, b) => {
      if (a.total < b.total) {
        return this.sortAscending ? -1 : 1;
      } else if (a.total > b.total) {
        return this.sortAscending ? 1 : -1;
      } else {
        return 0;
      }
    });
    this.sortAscending = !this.sortAscending;
    return this.orders;
  }
  sortOrdersByDate() {
    this.orders.sort((a, b) => {
      const dateA = new Date(a.dateCreated);
      const dateB = new Date(b.dateCreated);
      if (dateA < dateB) {
        return this.sortAscending ? -1 : 1;
      } else if (dateA > dateB) {
        return this.sortAscending ? 1 : -1;
      } else {
        return 0;
      }
    });
    this.sortAscending = !this.sortAscending;
    return this.orders;
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
  //filter order by payment method
  selectedPayment: string[] = [];
  filteredOrderByPayment: Order[] = [];
  filterPaymentMethod(checkboxId: string) {
    let checkboxElement: HTMLInputElement = document.getElementById(
      checkboxId
    ) as HTMLInputElement;
    if (checkboxElement.checked) {
      this.selectedPayment.push(checkboxElement.value);
      if (this.selectedStatus.length == 0) {
        this.orders = this.ordersTemp;
        this.filterPaymentMethodTemp();
      } else {
        this.orders = this.ordersTemp;
        this.filterPaymentMethodTemp();
        this.filterStatusTemp(this.orders);
      }
      // this.filterStatusTemp(this.orders);
    } else {
      this.selectedPayment = this.selectedPayment.filter(
        (item) => item !== checkboxElement.value
      );
      if (this.selectedPayment.length == 0) {
        if (this.selectedStatus.length == 0) {
          this.orders = this.ordersTemp;
        } else {
          this.orders = this.ordersTemp;
          this.filterStatusTemp(this.orders);
        }
      } else {
        this.filterPaymentMethodTemp();
        // this.filterStatusTemp(this.orders);
      }
    }
  }
  filterPaymentMethodTemp() {
    this.filteredOrderByPayment = [];
    for (let i = 0; i < this.ordersTemp.length; i++) {
      const order = this.ordersTemp[i];
      for (let j = 0; j < this.selectedPayment.length; j++) {
        if (
          order.paymentMethod.toLowerCase() ==
          this.selectedPayment[j].toLowerCase()
        ) {
          this.filteredOrderByPayment.push(order);
        }
      }
    }
    this.orders = this.filteredOrderByPayment;
  }

  //filter by status
  selectedStatus: string[] = [];
  filteredOrderByStatus: Order[] = [];
  filterStatus(checkboxId: string) {
    let checkboxElement: HTMLInputElement = document.getElementById(
      checkboxId
    ) as HTMLInputElement;
    if (checkboxElement.checked) {
      if (this.selectedPayment.length != 0) {
        this.selectedStatus.push(checkboxElement.value);
        this.filterPaymentMethodTemp();
        this.filterStatusTemp(this.orders);
      } else {
        this.selectedStatus.push(checkboxElement.value);
        this.filterStatusTemp(this.ordersTemp);
        console.log('test');
      }
    } else {
      this.selectedStatus = this.selectedStatus.filter(
        (item) => item !== checkboxElement.value
      );
      if (this.selectedStatus.length == 0) {
        if (this.selectedPayment.length == 0) {
          this.orders = this.ordersTemp;
        } else {
          this.filterPaymentMethodTemp();
        }
      } else {
        this.filterStatusTemp(this.orders);
      }
    }
  }
  filterStatusTemp(orders: any) {
    this.filteredOrderByStatus = [];
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      for (let j = 0; j < this.selectedStatus.length; j++) {
        if (
          order.status.toLowerCase() == this.selectedStatus[j].toLowerCase()
        ) {
          this.filteredOrderByStatus.push(order);
        }
      }
    }
    this.orders = this.filteredOrderByStatus;
  }
}
