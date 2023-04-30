import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent {
  @Input() editorConfig: any;
  product: any;
  // Sample data
  percentage: number = 0;
  sizetemp: any = null;
  colortemp: any = null;

  constructor(
    private service: ProductService,
    private activateRoute: ActivatedRoute,
    private router: Router
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
  updateProduct(product: Product) {
    if (window.confirm('Are you sure you want to update ' + '?')) {
      this.service.saveMetaDataOfFile(product);
      console.log(product);
    }
  }
  goBack() {
    this.router.navigate(['products']);
  }
}
