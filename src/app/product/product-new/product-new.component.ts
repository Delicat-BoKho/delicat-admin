import { Component, Input } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, forkJoin, switchMap, Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { Comment } from 'src/app/models/comment';
import { object } from '@angular/fire/database';

@Component({
  selector: 'app-product-new',
  templateUrl: './product-new.component.html',
  styleUrls: ['./product-new.component.css'],
})
export class ProductNewComponent {
  selectedFiles!: FileList;
  currentFileUpload: any;
  percentage: number = 0;
  products: any;
  product = new Product();
  errMessage: string = '';
  sizetemp: string = '';
  colortemp: string = '';
  reviewTemp = new Comment();
  productIdsss = ['A001', 'A002', 'A003'];
  listProduct: Array<Product> = [];

  @Input() editorConfig: any;

  constructor(
    private service: ProductService,
    private fireStorage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    // this.getProducts();
    // this.getProductByIds();
    console.log(this.listProduct);
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }
  async uploadFile() {
    const promises = [];

    for (let i = 0; i < this.selectedFiles.length; i++) {
      const path = 'ProductsTemp/' + this.selectedFiles[i].name;
      const storageRef = this.fireStorage.ref(path);
      const uploadTask = storageRef.put(this.selectedFiles[i]);

      const promise = new Promise((resolve, reject) => {
        uploadTask
          .snapshotChanges()
          .pipe(
            finalize(() => {
              storageRef.getDownloadURL().subscribe((downloadLink) => {
                this.product.imgURL.push(downloadLink);
                resolve(undefined);
              }, reject);
            })
          )
          .subscribe({
            next: (res: any) => {
              this.percentage = (res.bytesTransferred * 100) / res.totalBytes;
            },
            error: (err) => {
              console.log('Error occurred');
              reject(err);
            },
          });
      });
      promises.push(promise);
    }

    // Wait for all promises to complete before continuing
    await Promise.all(promises);

    this.product.size = this.sizetemp.split(',');
    this.product.color = this.colortemp.split(',');

    this.product.reviews.push(this.reviewTemp);

    this.service.saveMetaDataOfFile(this.product);
    this.product = new Product();
    this.reviewTemp = new Comment();
    this.sizetemp = '';
    this.colortemp = '';
    this.percentage = 0;
  }

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
  /////
  // getProductByIds() {
  //   for (let i = 0; i < this.productIdsss.length; i++) {
  //     this.service
  //       .getProduct(this.productIdsss[i])
  //       .subscribe((p) => this.listProduct.push(p));
  //   }
  // }

  ////
  //không xóa được hình lưu trong storage
  deleteProduct(product: Product) {
    if (window.confirm('Are you sure you want to delete ' + '?')) {
      this.service.deleteProduct(product);
      // this.ngOnInit();
    }
  }

  updateProduct(product: Product) {
    if (window.confirm('Are you sure you want to update ' + '?')) {
      this.service.saveMetaDataOfFile(product);
      console.log(product);
      // this.ngOnInit();
    }
  }

  cancel() {}
  createProduct() {}
}
