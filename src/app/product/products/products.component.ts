import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaginationInstance } from 'ngx-pagination';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  modalRef: BsModalRef | null = null;

  errMessage: string = '';
  productToDelete: any;

  // Define pagination
  paginationConfig: PaginationInstance = {
    id: 'products',
    itemsPerPage: 8,
    currentPage: 1,
  };
  onPageChange(pageNumber: number) {
    this.paginationConfig.currentPage = pageNumber;
  }

  // Sample data
  products: Array<Product> = [
    {
      id: '1',
      name: 'Product 1',
      type: 'Type 1',
      price: 100,
      imgURL: ['https://picsum.photos/200/300'],
      describe: 'This is product 1',
      tag: 'tag 1',
      size: 'size 1',
      color: 'color 1',
      reviews: [
        {
          id: '1',
          ratingComment: 5,
          userName: '',
          dateCreate: '',
          review: '',
        },
      ],
    },
  ];

  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
    // Code to view all products here
  }

  confirmDeleteProduct(product: any): void {
    this.productToDelete = product;
    this.modalRef = this.modalService.show(this.deleteConfirmationModal, {
      class: 'modal-dialog-centered',
    });
  }

  deleteProduct() {
    // Code to delete the product here
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  cancelDeleteProduct() {
    this.productToDelete = null;
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
}
