import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/models/order';
import {
  Product,
  ProductLine,
  ProductLineInCart,
} from 'src/app/models/product';
import { CustomerService } from 'src/app/services/customer.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { parse, format } from 'date-fns';
@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css'],
})
export class CustomerEditComponent {
  showPassword: boolean = false;
  customer: any;
  productDetailinCart: Array<Product> = [];
  productDetailinWishlist: Array<Product> = [];

  orders: Array<Order> = [];
  //mảng chứa id các sản phẩm trong cart
  arrayProductIdInCart: string[] = [];
  public productLineShow: Array<ProductLineInCart> = [];

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  // lấy customer từ id
  getCustomer(id: string) {
    this.service.getCustomer(id).subscribe({
      next: (res: any) => {
        this.customer = res;
        console.log(this.customer);
        console.log('ProductID in wishlist: ' + this.customer.wishlist);
        this.getOrderByIds(this.customer.order);
        for (let i = 0; i < this.customer.cart.length; i++) {
          this.arrayProductIdInCart.push(this.customer.cart[i].productId);
        }
        console.log('ProductID in cart: ' + this.arrayProductIdInCart);
        this.getProductsInCartByIds(this.arrayProductIdInCart);
        this.getProductsInWishListtByIds(this.customer.wishlist);
      },
    });
  }
  constructor(
    private service: CustomerService,
    private orderService: OrderService,
    private activateRoute: ActivatedRoute,
    private serviceProduct: ProductService,
    private router: Router
  ) {
    activateRoute.paramMap.subscribe((param) => {
      let id = param.get('id');
      if (id != null) {
        this.getCustomer(id);
        console.log(id);
      }
    });
  }
  getProductsInCartByIds(productIdInCart: string[]) {
    this.serviceProduct.getProductsByIds(productIdInCart).subscribe({
      next: (ress: any) => {
        this.productDetailinCart = ress;
        console.log('listproduct in wishlist');
        console.log(this.productDetailinCart);
      },
    });
  }
  getProductsInWishListtByIds(productIdInWl: string[]) {
    console.log(productIdInWl);
    this.serviceProduct.getProductsByIds(productIdInWl).subscribe({
      next: (res: any) => {
        this.productDetailinWishlist = res;
        console.log('listproduct in cart');
        console.log(this.productDetailinWishlist);
        this.setProductLine();
      },
    });
  }
  //lấy danh sách sản phẩm từ 2 mảng productIds tỏng cart và productId trong wl

  //lấy order ra từ list order
  getOrderByIds(ids: string[]) {
    this.orderService.getOrdersByIds(ids).subscribe({
      next: (res: any) => {
        this.orders = res;
      },
    });
  }
  // convertDate(date: any) {
  //   date = parse(date, 'MMMM d, yyyy', new Date());
  //   date = format(date, 'MM/dd/yyyy');
  //   const dateParts = date.split('/');
  //   date = new Date(+dateParts[2], +dateParts[0] - 1, +dateParts[1]);
  //   date = date.toISOString().substring(0, 10);
  //   return date;
  // }

  //gán dữ liệu cho 1 model mới là một object trong cart (kết hợp dữ liệu product trong bảng product qua productId)
  setProductLine() {
    for (let i = 0; i < this.arrayProductIdInCart.length; i++) {
      this.productLineShow[i] = new ProductLineInCart(); // Initialize object before setting properties
      this.productLineShow[i].id = this.arrayProductIdInCart[i];

      // Check if productDetail array exists and has enough elements
      if (this.productDetailinCart && this.productDetailinCart.length > i) {
        this.productLineShow[i].name = this.productDetailinCart[i].name;
        this.productLineShow[i].type = this.productDetailinCart[i].type;
        this.productLineShow[i].unitPrice = this.productDetailinCart[i].price;

        this.productLineShow[i].imgURL = this.productDetailinCart[i].imgURL[0];
        this.productLineShow[i].tag = this.productDetailinCart[i].tag;

        // gọi hàm tách describe thành [size,color]
        var describeSplit = this.splitDescribe(
          this.customer.cart[i].description
        );

        this.productLineShow[i].size = describeSplit[1];
        this.productLineShow[i].color = describeSplit[0];
        this.productLineShow[i].quantity = this.customer.cart[i].quantity;
        this.productLineShow[i].describeProductLine =
          this.customer.cart[i].description;
      }
    }
    console.log(this.productLineShow);
  }
  splitDescribe(describe: string): [string, string] {
    var temp = describe.split(',');
    var size = temp[0];
    var color = temp[1];
    return [size, color];
  }
  onSave() {}
  goBack() {
    this.router.navigate(['customers']);
  }
}
