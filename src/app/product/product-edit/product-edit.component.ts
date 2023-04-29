import { Component, Input } from '@angular/core';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent {
  @Input() editorConfig: any;

  // Sample data
  product = new Product();
  percentage: number = 0;
  sizetemp: any = null;
  colortemp: any = null;

  constructor() {
    this.product.id = 'P001';
  }

  onSave() {}
  goBack() {}
}
