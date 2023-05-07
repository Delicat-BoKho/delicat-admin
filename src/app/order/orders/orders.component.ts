import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaginationInstance } from 'ngx-pagination';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { Router, RouterLink } from '@angular/router';
import { Order } from 'src/app/models/order';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  modalRef: BsModalRef | null = null;
  orders: any;
  errMessage: string = '';
  orderToDelete: any;
  public saleProduct: any;
  public productId: string = '';
  public orderId: string = '';
  orderIdDelete: string = '';
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  ngOnInit(): void {
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
    private modalService: BsModalService,
    private service: OrderService,
    private Pservice: ProductService,
    private router: Router
  ) {}
  setOrderID(id: string) {
    this.orderId = id;
    console.log('Giá trị của orderID:', this.orderId);
  }
  confirmDeleteOrder(order: any): void {
    this.orderIdDelete = order.id;
    this.modalRef = this.modalService.show(this.deleteConfirmationModal, {
      class: 'modal-dialog-centered',
    });
  }

  deleteOrder() {
    this.service.deleteOrder(this.orderIdDelete);
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

  ViewOrderDetail(id: string) {
    this.router.navigate(['order-edit/' + id]);
  }
  ViewCustomerDetail(id: string) {
    this.router.navigate(['customer-edit/' + id]);
  }
}
