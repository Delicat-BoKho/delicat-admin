import { Component } from '@angular/core';
import * as echarts from 'echarts';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { CustomerService } from '../services/customer.service';
@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent {
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

  constructor(
    private OrderService: OrderService,
    private CustomerService: CustomerService
  ) {
    this.getOrders();
    this.getCustomers();
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
}