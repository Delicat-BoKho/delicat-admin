import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import * as echarts from 'echarts';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  products: Product[] = [];
  orders: Order[] = [];
  errMessage: string = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.renderChart0();
    this.renderChart1();
    this.renderChart2();
  }

  renderChart0(): void {
    this.orderService.getOrders().subscribe({
      next: (res: any) => {
        this.orders = res;
        this.productService.getProducts().subscribe({
          next: (res: any) => {
            this.products = res;
            // Create a map to store the total sales for each product type
            const salesByType = new Map<string, number>();
            this.products.forEach((product) => {
              if (product.type) {
                salesByType.set(product.type, 0);
              }
            });
            this.orders.forEach((order) => {
              order.saleProducts.forEach((saleProduct) => {
                const product = this.products.find(
                  (p) => p.id === saleProduct.productId
                );
                if (product && salesByType.has(product.type)) {
                  const type = product.type;
                  const quantity = saleProduct.quantity;
                  const totalSales = salesByType.get(type) || 0;
                  salesByType.set(type, totalSales + quantity);
                }
              });
            });

            const chartData = Array.from(salesByType).map(([type, sales]) => ({
              name: type,
              value: sales,
            }));

            let chartElement = document.getElementById('chart0');

            if (chartElement) {
              let chart = echarts.init(chartElement);

              let option = {
                textStyle: {
                  fontFamily: "'Kanit', sans-serif",
                },
                title: {
                  text: 'Sales by Product Type',
                  left: 'center',
                },
                tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b}: {c} ({d}%)',
                },
                series: [
                  {
                    name: 'Sales',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                      borderRadius: 10,
                      borderColor: '#fff',
                      borderWidth: 2,
                    },
                    data: chartData,
                    label: {
                      show: true,
                      formatter: '{b} ({d}%)',
                    },
                    labelLine: {
                      show: true,
                    },
                  },
                ],
              };

              chart.setOption(option);
            }
          },
          error: (err) => {
            this.errMessage = err;
            console.log('Error get products: ' + err);
          },
        });
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error inside get orders: ' + err);
      },
    });
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
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/> ${b}: {c} (times)',
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
                name: 'Appearances',
                data: counts,
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                  color: 'rgba(180, 180, 180, 0.2)',
                },
                label: {
                  show: true,
                  position: 'top',
                  color: 'black',
                  fontSize: 12,
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

  renderChart2(): void {
    this.orderService.getOrders().subscribe({
      next: (res: any) => {
        this.orders = res;
        this.productService.getProducts().subscribe({
          next: (res: any) => {
            this.products = res;
            // Create a map to store the revenue for each product type
            const revenueByType = new Map<string, number>();
            this.products.forEach((product) => {
              if (product.type) {
                revenueByType.set(product.type, 0);
              }
            });
            this.orders.forEach((order) => {
              order.saleProducts.forEach((saleProduct) => {
                const product = this.products.find(
                  (p) => p.id === saleProduct.productId
                );
                if (product && revenueByType.has(product.type)) {
                  const type = product.type;
                  const quantity = saleProduct.quantity;
                  const unitPrice = saleProduct.unitPrice;
                  const totalSales = revenueByType.get(type) || 0;
                  revenueByType.set(type, totalSales + quantity * unitPrice);
                }
              });
            });

            const chartData = Array.from(revenueByType).map(
              ([type, sales]) => ({
                name: type,
                value: sales,
              })
            );

            let chartElement = document.getElementById('chart2');

            if (chartElement) {
              let chart = echarts.init(chartElement);

              let option = {
                textStyle: {
                  fontFamily: "'Kanit', sans-serif",
                },
                title: {
                  text: 'Revenue by Product Type',
                  left: 'center',
                },
                tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b}: ${c} ({d}%)',
                },
                series: [
                  {
                    name: 'Revenue',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                      borderRadius: 10,
                      borderColor: '#fff',
                      borderWidth: 2,
                    },
                    data: chartData,
                    label: {
                      show: true,
                      formatter: '{b} ({d}%)',
                    },
                    labelLine: {
                      show: true,
                    },
                  },
                ],
              };

              chart.setOption(option);
            }
          },
          error: (err) => {
            this.errMessage = err;
            console.log('Error get products: ' + err);
          },
        });
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error inside get orders: ' + err);
      },
    });
  }
}
