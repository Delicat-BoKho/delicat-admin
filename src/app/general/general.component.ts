import { Component } from '@angular/core';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { OrderService } from '../services/order.service';
import { Order } from '../models/order';
import { Product, ProductLine } from '../models/product';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent {
  orders: Order[] = [];
  months: string[] = [];
  totals: number[] = [];
  // mảng chứa các id của sản phẩm được mua nằm trong order
  arrayProductIdInLine: string[] = [];

  // thông tin chi tiết của từng sản phẩm được mua
  productDetail: Array<Product> = [];
  // thông tin chi tiết từng sản phẩm kèm số lượng được mua
  public productLineShow: Array<ProductLine> = [];
  orderTemps: Order[] = [];
  constructor(
    private OrderService: OrderService,
    private authService: AuthService,
    private activateRoute: ActivatedRoute,
    private serviceProduct: ProductService,
    private router: Router,
    private location: Location
  ) {
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

  pieChartNumberProductByTypes() {
    type EChartsOption = echarts.EChartsOption;
    var chartDom = document.getElementById('main2')!;
    var myChart = echarts.init(chartDom);
    var option: EChartsOption;
    option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' },
          ],
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
