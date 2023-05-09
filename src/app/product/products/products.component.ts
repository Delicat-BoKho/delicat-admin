import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PaginationInstance } from 'ngx-pagination';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  @ViewChild('deleteConfirmationModal') deleteConfirmationModal: any;
  modalRef: BsModalRef | null = null;
  products: Product[] = []; //product list show to user
  productsOrigin: Product[] = [];
  productsTemp: Product[] = [];
  foundProducts: Product[] = [];
  errMessage: string = '';
  searchProduct: string = '';
  productIdDelete: string = '';
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
    private authService: AuthService,
    private fireStorage: AngularFireStorage,
    private router: Router
  ) {
    this.getProducts();
  }

  ngOnInit(): void {
    this.authService.checkValidUser();
  }

  //get all products
  getProducts() {
    this.service.getProducts().subscribe({
      next: (res: any) => {
        this.productsOrigin = res;
        this.productsTemp = this.productsOrigin;
        this.products = this.productsTemp;
        this.filteredTypeProducts = this.productsTemp;
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
    this.productIdDelete = product.id;
    this.modalRef = this.modalService.show(this.deleteConfirmationModal, {
      class: 'modal-dialog-centered',
    });
  }
  // Code to delete the product here

  deleteProduct(product: Product) {
    this.service.deleteProduct(this.productIdDelete);
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  cancelDeleteProduct() {
    this.productIdDelete = '';
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }
  //search kí tự có tồn tại trong tên của sản phẩm
  search() {
    this.foundProducts = [];
    for (let i = 0; i < this.productsOrigin.length; i++) {
      const product = this.productsOrigin[i];
      if (
        product.name.toLowerCase().includes(this.searchProduct.toLowerCase())
      ) {
        this.foundProducts.push(product);
      }
    }
    this.productsTemp = this.foundProducts;
    this.products = this.productsTemp;
  }
  sortAscending: boolean = true;
  //sort product theo giá
  sortProductsByPrice() {
    // Sử dụng phương thức sort() để sắp xếp các sản phẩm theo giá
    this.products.sort((a, b) => {
      if (a.price < b.price) {
        return this.sortAscending ? -1 : 1;
      } else if (a.price > b.price) {
        return this.sortAscending ? 1 : -1;
      } else {
        return 0;
      }
    });
    this.sortAscending = !this.sortAscending;
    return this.products;
  }

  selectedType: string[] = [];
  filteredTypeProducts: Product[] = [];
  //hàm uncheck

  ///// ----/////FILTER TYPE
  //hàm này lấy value khi bắt event click vào checkbox
  filterTypeProducts(checkboxId: string) {
    let checkboxElement: HTMLInputElement = document.getElementById(
      checkboxId
    ) as HTMLInputElement;
    this.selectedTag = [];
    if (checkboxElement.checked) {
      this.selectedType.push(checkboxElement.value);
      this.filterTypeProductsTemp();
      console.log(checkboxElement.value, this.selectedType);
    } else {
      this.selectedType = this.selectedType.filter(
        (item) => item !== checkboxElement.value
      );
      if (this.selectedType.length == 0) {
        this.products = this.productsTemp;
        this.filteredTypeProducts = this.products;
      } else {
        this.filterTypeProductsTemp();
      }
    }
  }
  //hàm này sẽ thực thi gán dữ liệu sau khi filter vào products để show lên
  filterTypeProductsTemp() {
    this.filteredTypeProducts = [];
    console.log(this.products);
    for (let i = 0; i < this.productsTemp.length; i++) {
      const product = this.productsTemp[i];
      for (let j = 0; j < this.selectedType.length; j++) {
        if (product.type.toLowerCase() == this.selectedType[j]) {
          this.filteredTypeProducts.push(product);
        }
      }
    }
    this.products = this.filteredTypeProducts;
  }
  //--------------------------------------------------//

  ///// ----/////FILTER TAG

  filteredTagProducts: Product[] = [];
  selectedTag: string[] = [];
  filterTagProductsTemp() {
    this.filteredTagProducts = [];
    for (let i = 0; i < this.filteredTypeProducts.length; i++) {
      const product = this.filteredTypeProducts[i];
      for (let j = 0; j < this.selectedTag.length; j++)
        if (product.tag.toLowerCase() == this.selectedTag[j]) {
          this.filteredTagProducts.push(product);
        }
    }
    this.products = this.filteredTagProducts;
  }

  // hàm này sẽ bắt sự kiện click
  filterTagProducts(checkboxId: string) {
    let checkboxElement: HTMLInputElement = document.getElementById(
      checkboxId
    ) as HTMLInputElement;
    if (checkboxElement.checked) {
      this.selectedTag.push(checkboxElement.value);
      this.filterTagProductsTemp();
      console.log(checkboxElement.value, this.selectedType);
    } else {
      if (this.selectedTag.length == 0) {
        if (this.selectedType.length == 0) {
          this.products = this.productsTemp;
        } else {
          this.filterTypeProductsTemp();
        }
      } else {
        this.selectedTag = this.selectedTag.filter(
          (item) => item !== checkboxElement.value
        );
        if (this.selectedType.length == 0) {
          this.products = this.productsTemp;
          console.log('test');
        } else {
          this.filterTypeProductsTemp();
        }
      }
    }
  }
  //--------------------------------------------------//
  //không search nữa
  back() {
    this.products = this.productsOrigin;
    this.searchProduct = '';
  }
}
