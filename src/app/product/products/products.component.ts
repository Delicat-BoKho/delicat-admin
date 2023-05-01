import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaginationInstance } from 'ngx-pagination';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  modalRef: BsModalRef | null = null;
  products: any;
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

  constructor(
    private modalService: BsModalService,
    private service: ProductService,
    private fireStorage: AngularFireStorage,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Code to view all products here
    this.getProducts();
  }
  //get all products
  getProducts() {
    this.service.getProducts().subscribe({
      next: (res: any) => {
        this.products = res;
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }
  //get a product by id
  getProduct(id: string) {
    this.router.navigate(['product-edit/' + id]);
  }
  confirmDeleteProduct(product: any): void {
    this.productToDelete = product;
    this.modalRef = this.modalService.show(this.deleteConfirmationModal, {
      class: 'modal-dialog-centered',
    });
  }
  // Code to delete the product here

  deleteProduct(product: Product) {
    this.service.deleteProduct(product);
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
