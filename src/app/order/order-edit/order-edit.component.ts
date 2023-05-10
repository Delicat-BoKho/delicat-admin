import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Product, ProductLine } from 'src/app/models/product';
import { Location } from '@angular/common';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { parse, format } from 'date-fns';
import { Order } from 'src/app/models/order';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css'],
})
export class OrderEditComponent implements OnInit {
  // Sample data
  public order: any;
  errMessage: string = '';
  // mảng chứa các id của sản phẩm được mua nằm trong order
  arrayProductIdInLine: string[] = [];

  // thông tin chi tiết của từng sản phẩm được mua
  productDetail: Array<Product> = [];
  // thông tin hiển thị lên UI
  public productLineShow: Array<ProductLine> = [];
  ngOnInit(): void {
    this.authService.checkValidUser();
  }
  constructor(
    private modalService: BsModalService,
    private service: OrderService,
    private authService: AuthService,
    private activateRoute: ActivatedRoute,
    private serviceProduct: ProductService,
    private router: Router,
    private location: Location
  ) {
    activateRoute.paramMap.subscribe((param) => {
      let id = param.get('id');
      if (id != null) {
        this.getOrder(id);
        console.log(id);
      }
    });
  }

  //get orderby id --> get object order đồng tời push dô mảng saleproductIDs[A001,A003]
  //get prodctbyids[saleproductIDs[A001,A003] --> get được listproduct

  // Hàm lấy ra thông tin chi tiết của order by ID
  getOrder(id: string) {
    this.productDetail = [];
    this.arrayProductIdInLine = [];
    this.service.getOrder(id).subscribe({
      next: (res: any) => {
        this.order = res;
        //chuyen doi kieu date
        // this.order.dateCreated = this.convertDate(this.order.dateCreated);
        console.log(this.order);
        // đẩy hết productID mà KH mua vào mảng arrayProductIdInLine
        for (let i = 0; i < this.order.saleProducts.length; i++) {
          this.arrayProductIdInLine.push(this.order.saleProducts[i].productId);
        }

        // check các productID nằm trong mảng arrayProductIdInLine
        console.log('ProductID in order: ' + this.arrayProductIdInLine);

        // gọi hàm lấy ra danh sách sản phẩm dựa vòa mảng arrayProductIdInLine
        this.getProductByIds(this.arrayProductIdInLine);
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }
  // ham chuyen doi kieu date
  convertDate(date: any) {
    date = parse(date, 'MMMM d, yyyy', new Date());
    date = format(date, 'MM/dd/yyyy');
    const dateParts = date.split('/');
    date = new Date(+dateParts[2], +dateParts[0] - 1, +dateParts[1]);
    date = date.toISOString().substring(0, 10);
    return date;
  }
  // Hàm lấy ra danh sách sản phẩm dựa vòa mảng cho trước
  getProductByIds(ids: string[]) {
    console.log(ids);
    this.serviceProduct.getProductsByIds(ids).subscribe({
      next: (res: any) => {
        this.productDetail = res;

        // Initialize productLineShow array
        this.productLineShow = new Array(ids.length);

        // gọi hàm set dữ liệu vào ProductLine
        this.setProductLine();
      },
    });
  }

  // Hàm set dữ liệu vào ProductLine
  setProductLine() {
    for (let i = 0; i < this.arrayProductIdInLine.length; i++) {
      this.productLineShow[i] = new ProductLine(); // Initialize object before setting properties

      this.productLineShow[i].id = this.arrayProductIdInLine[i];

      // Check if productDetail array exists and has enough elements
      if (this.productDetail && this.productDetail.length > i) {
        this.productLineShow[i].name = this.productDetail[i].name;
        this.productLineShow[i].type = this.productDetail[i].type;
        this.productLineShow[i].imgURL = this.productDetail[i].imgURL[0];
        this.productLineShow[i].tag = this.productDetail[i].tag;

        // gọi hàm tách describe thành [size,color]
        var describeSplit = this.splitDescribe(
          this.order.saleProducts[i].description
        );

        this.productLineShow[i].size = describeSplit[1];
        this.productLineShow[i].color = describeSplit[0];
        this.productLineShow[i].quantity = this.order.saleProducts[i].Quantity;
        this.productLineShow[i].describeProductLine =
          this.order.saleProducts[i].Description;
        this.productLineShow[i].unitPrice =
          this.order.saleProducts[i].unitPrice;
      }
    }
    console.log(this.productLineShow);
  }

  // Hàm tách describe thành [size,color]
  splitDescribe(describe: string): [string, string] {
    var temp = describe.split(',');
    var size = temp[1];
    var color = temp[0];
    return [size, color];
  }
  //go back page view all orders
  goBack() {
    this.router.navigate(['orders']);
  }
  onSave(order: Order) {
    if (window.confirm('Are you sure you want to update ' + '?')) {
      this.service.saveMetaDataOfFile(order);
      console.log('tests');
      console.log(order);
      this.router.navigate(['orders']);
    }
  }

  public editable: boolean = false;
  toggleEdit() {
    this.editable = !this.editable;
  }
}
