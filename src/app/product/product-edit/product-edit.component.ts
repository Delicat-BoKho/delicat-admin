import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent implements OnInit {
  product: any;
  percentage: number = 0;

  @ViewChild('saveChangesConfirmationModal') saveChangesConfirmationModal: any;
  modalRef: BsModalRef | null = null;

  ngOnInit(): void {
    this.authService.checkValidUser();
  }
  constructor(
    private modalService: BsModalService,
    private service: ProductService,
    private authService: AuthService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    activateRoute.paramMap.subscribe((param) => {
      let id = param.get('id');
      if (id != null) {
        this.getProduct(id);
        console.log(id);
      }
    });
  }
  getProduct(id: string) {
    this.service.getProduct(id).subscribe({
      next: (res: any) => {
        this.product = res;
        console.log(this.product);
      },
    });
  }

  confirmSaveChanges(product: Product) {
    this.product = product;
    this.modalRef = this.modalService.show(this.saveChangesConfirmationModal, {
      class: 'modal-dialog-centered',
    });
  }

  updateProduct(product: Product) {
    this.service.saveMetaDataOfFile(this.product);
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  cancel() {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

  goBack(): void {
    this.location.back();
  }
  public editable: boolean = false;
  toggleEdit() {
    this.editable = !this.editable;
  }
}
