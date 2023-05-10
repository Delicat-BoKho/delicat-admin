import { Component } from '@angular/core';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent {
  orders: Order[] = [];
  months: string[] = [];
  totals: number[] = [];
  orderTemps: Order[] = [];
  constructor(private OrderService: OrderService) {
    this.getOrders();
  }
  getOrders() {
    this.OrderService.getOrders().subscribe({
      next: (res: any) => {
        this.orders = res;
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

        const totals = Object.values(result);
        const months = Object.keys(result).map(String);
        this.totals = totals;
        this.months = months;
        this.convertMonth(this.months);
      },
      error: (err) => {
        this.errMessage = err;
        console.log('Error occured while fetching file meta data');
      },
    });
  }

  graph: any;
  option: any;
  chartOption!: EChartsOption;
  errMessage: string = '';
  lineChartRevenueByMonths() {
    type EChartsOption = echarts.EChartsOption;
    var chartDom = document.getElementById('main')!;
    var myChart = echarts.init(chartDom);
    var option: EChartsOption;

    // Chuyển đổi object thàconst yearlyTotals = totals.reduce((acc, total, index) => {

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
          data: this.totals,
          type: 'line',
          areaStyle: {},
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
