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
  products: Product[] = [];
  errMessage: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.renderChart1();
  }

  renderChart1(): void {
    this.productService.getProducts().subscribe({
      next: (res: any) => {
        this.products = res;
        let prices = this.products.map((p) => (p ? p.price : 0));
        let distinctPrices = [...new Set(prices)];
        distinctPrices.sort((a, b) => a - b);
        prices.sort((a, b) => a - b);
        // count the number of distinctPrice in prices
        let counts = [];
        let j = 0;
        for (let i = 0; i < distinctPrices.length; i++) {
          let count = 0;
          while (j < prices.length && prices[j] === distinctPrices[i]) {
            count++;
            j++;
          }
          counts.push(count);
        }

        let chartElement = document.getElementById('chart1');

        if (chartElement) {
          let chart = echarts.init(chartElement);

          let option = {
            textStyle: {
              fontFamily: "'Kanit', sans-serif",
            },
            title: {
              text: 'Product Price Counts',
              left: 'center',
            },
            xAxis: {
              type: 'category',
              data: distinctPrices,
              name: 'Price',
            },
            yAxis: {
              type: 'value',
              name: 'Count',
            },
            series: [
              {
                data: counts,
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                  color: 'rgba(180, 180, 180, 0.2)',
                },
                itemStyle: {
                  color: '#1565c0',
                },
                label: {
                  show: true, // enable label display
                  position: 'top', // display labels on top of bars
                  color: 'black', // set label text color
                  fontSize: 12, // set label font size
                },
              },
            ],
          };

          chart.setOption(option);
        }
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error: ' + err);
      },
    });
  }
}
