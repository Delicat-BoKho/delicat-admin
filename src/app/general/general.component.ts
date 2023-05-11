import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { CustomerService } from '../services/customer.service';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent implements OnInit {
  faShoppingCart = faShoppingCart;

  public order: any;
  orders: Order[] = [];
  customers: any;
  countCustomers: number = 0;
  months: string[] = [];
  totalsForLineChart: number[] = [];
  revenue: number = 0;
  errMessage: string = '';
  countOrders: number = 0;
  countSoldProducts: number = 0;
  products: Product[] = [];

  constructor(
    private OrderService: OrderService,
    private CustomerService: CustomerService,
    private ProductService: ProductService
  ) {
    this.getOrders();
    this.getCustomers();
  }

  ngOnInit(): void {
    this.lineChartRevenueByMonths();
  }

  getOrders() {
    this.OrderService.getOrders().subscribe({
      next: (res: any) => {
        this.orders = res;
        this.countOrders = this.orders.length;
        this.caculateRevenue();
        this.caculateSaledProducts();
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }
  getCustomers() {
    this.CustomerService.getCustomers().subscribe({
      next: (res: any) => {
        this.customers = res;
        this.countCustomers = this.customers.length;
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }
  caculateRevenue() {
    for (let i = 0; i < this.orders.length; i++) {
      this.revenue += this.orders[i].total;
    }
  }
  caculateSaledProducts() {
    for (let i = 0; i < this.orders.length; i++) {
      for (let j = 0; j < this.orders[i].saleProducts.length; j++) {
        this.countSoldProducts += this.orders[i].saleProducts[j].quantity;
      }
    }
  }
  getDataForLineChartRevenue() {
    interface YearlyTotal {
      [months: number]: number;
    }

    const result = this.orders.reduce((acc: YearlyTotal, order) => {
      if (!order.dateCreated) {
        return acc;
      }
      const months = new Date(order.dateCreated).getMonth() + 1;
      if (!acc[months]) {
        acc[months] = 0;
      }
      acc[months] += order.total;
      return acc;
    }, {});
    this.totalsForLineChart = Object.values(result);
    this.months = Object.keys(result).map(String);

    this.convertMonth(this.months);
  }
  lineChartRevenueByMonths() {
    this.getDataForLineChartRevenue();
    type EChartsOption = echarts.EChartsOption;
    var chartDom = document.getElementById('lineChart')!;
    var myChart = echarts.init(chartDom);
    var option: EChartsOption;
    option = {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.months,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: this.totalsForLineChart,
          type: 'line',
          areaStyle: {},
          smooth: true,
        },
      ],
    };
    option && myChart.setOption(option);
  }

  convertMonth(months: string[]) {
    for (let i = 0; i < months.length; i++) {
      if (months[i] == '1') {
        months[i] = 'January';
      } else if (months[i] == '2') {
        months[i] = 'February';
      } else if (months[i] == '3') {
        months[i] = 'March';
      } else if (months[i] == '4') {
        months[i] = 'April';
      } else if (months[i] == '5') {
        months[i] = 'May';
      } else if (months[i] == '6') {
        months[i] = 'June';
      } else if (months[i] == '7') {
        months[i] = 'July';
      } else if (months[i] == '8') {
        months[i] = 'August';
      } else if (months[i] == '9') {
        months[i] = 'September';
      } else if (months[i] == '10') {
        months[i] = 'October';
      } else if (months[i] == '11') {
        months[i] = 'November';
      } else if (months[i] == '12') {
        months[i] = 'December';
      }
    }
  }

  renderChart0(): void {
    this.OrderService.getOrders().subscribe({
      next: (res: any) => {
        this.orders = res;
        this.ProductService.getProducts().subscribe({
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
    this.ProductService.getProducts().subscribe({
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
    this.OrderService.getOrders().subscribe({
      next: (res: any) => {
        this.orders = res;
        this.ProductService.getProducts().subscribe({
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
