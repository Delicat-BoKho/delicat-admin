import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaginationInstance } from 'ngx-pagination';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit, AfterViewInit {
  modalRef: BsModalRef | null = null;
  orders: any;
  public saleProduct: any;
  errMessage: string = '';
  orderToDelete: any;
  public ProductId: string = '';
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  ngOnInit(): void {
    // Code to view all orders here
    this.getOrders();
    console.log(this.getProduct(this.ProductId));
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
  //lay san pham tu order
  getProduct(id: string) {
    this.Pservice.getProduct(id).subscribe({
      next: (res: any) => {
        console.log(res.name);
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }
  // Sample data
  // orders: any = [
  //   {
  //     id: 'O000',
  //     date: '2023-04-15',
  //     products: [
  //       { id: '1', name: 'Product1', quantity: 2 },
  //       { id: '2', name: 'Product 2', quantity: 1 },
  //       {
  //         id: 'S301',
  //         name: 'Oatmeal Sharkskin Slim Fit Suit',
  //         quantity: 3,
  //       },
  //     ],
  //     total: 500,
  //     customerID: 'C001',
  //     paymentMethod: 'Cash',
  //     status: 'completed',
  //   },
  //   {
  //     id: 'O001',
  //     date: '2023-04-16',
  //     paymentMethod: 'Credit Card',
  //     products: [
  //       { name: 'Product 2', quantity: 1 },
  //       { name: 'Product 4', quantity: 2 },
  //     ],
  //     total: 300,
  //     customerID: 'C002',
  //     status: 'pending',
  //   },
  //   {
  //     id: 'O002',
  //     date: '2023-04-16',
  //     paymentMethod: 'Credit Card',
  //     products: [
  //       { name: 'Product 2', quantity: 1 },
  //       { name: 'Product 4', quantity: 2 },
  //     ],
  //     total: 300,
  //     customerID: 'C003',
  //     status: 'dispatched',
  //     deliveryAddress: '1234 Main St, New York, NY 10001',
  //   },
  //   {
  //     id: 'O003',
  //     date: '2023-04-16',
  //     paymentMethod: 'Credit Card',
  //     products: [
  //       { name: 'Product 2', quantity: 1 },
  //       { name: 'Product 4', quantity: 2 },
  //     ],
  //     total: 300,
  //     customerID: 'C003',
  //     status: 'unknown',
  //     deliveryAddress: '1234 Main St, New York, NY 10001',
  //   },
  // ];

  constructor(
    private modalService: BsModalService,
    private service: OrderService,
    private Pservice: ProductService
  ) {}

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

  //Get orders
}
