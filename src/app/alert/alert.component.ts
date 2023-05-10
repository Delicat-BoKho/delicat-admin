import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import * as echarts from 'echarts';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  products: Product[] = []; //product list show to user
  productsOrigin: Product[] = [];
  productsTemp: Product[] = [];
  foundProducts: Product[] = [];
  errMessage: string = '';
  searchProduct: string = '';
  prices: number[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.renderChart1();
  }

  renderChart1(): void {
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.productsOrigin = res;
        this.productsTemp = this.productsOrigin;
        this.products = this.productsTemp;
        this.prices = this.productsOrigin.map((p) => (p ? p.price : 0));
        let distinctPrices = [...new Set(this.prices)];
        distinctPrices.sort((a, b) => a - b);
        this.prices.sort((a, b) => a - b);
        // count the number of distinctPrice in prices
        let counts = [];
        let j = 0;
        for (let i = 0; i < distinctPrices.length; i++) {
          let count = 0;
          while (
            j < this.prices.length &&
            this.prices[j] === distinctPrices[i]
          ) {
            count++;
            j++;
          }
          counts.push(count);
        }

        let chartElement = document.getElementById('chart1');

        if (chartElement) {
          let chart = echarts.init(chartElement);

          let option = {
            xAxis: {
              type: 'category',
              data: distinctPrices,
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                data: counts,
                type: 'bar',
              },
            ],
          };

          chart.setOption(option);
        }
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }
}
