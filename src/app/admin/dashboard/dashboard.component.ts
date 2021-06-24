import { Component, OnInit } from "@angular/core";

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label, SingleDataSet, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import {
  revenueAreaChart,
  targetsBarChart,
  salesDonutChart,
  ordersData,
} from "./data";

import { MyChartType, OrdersTable } from "./dashboard.model";
import { ThemeService } from "src/app/theme.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})

/**
 * Dashboard component - handling dashboard with sidear and content
 */
export class DashboardComponent implements OnInit {
  totalProfit: any;
  revenueAreaChart: MyChartType;
  targetsBarChart: MyChartType;
  salesDonutChart: MyChartType;
  ordersData: OrdersTable[];
  todaySale: number = 0;
  todaySaleValue: any=152;
  todaySaleDown: boolean = true;
  todayPer: number = 6;
  lastClose: number = 1212;
  lastCloseValue: any="2151";
  toCustomer: number = 0;
  monthlysale: number = 2151;
  monthlysaleValue: any="21";
  dailysale: number[] = [];
  monthSaleDown: boolean = true;
  monthPer: number = 2;
  monthPerValue: any=21;
  lastMonth: number = 215;
  lastMonthValue: any=1522;
  todayPerValue: any=12;
  data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false
  };
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgb(239,163,10)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartData: SingleDataSet = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];



  constructor(public theme:ThemeService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    let today = new Date();
    let date =
      today.getDate() +
      "/ " +
      `${today.getMonth() + 1}` +
      "/ " +
      today.getFullYear();
    let yesterday =
      `${today.getDate() - 1}` +
      "/ " +
      `${today.getMonth() + 1}` +
      "/ " +
      today.getFullYear();
    let lastMonth = `${today.getMonth()}`;
    let thisMonth = date.split("/ ", 2);
    // this.orders.receiptsData.forEach((sale) => {
    //   //getting today's total sale data
    //   if (sale.date === date) {
    //     this.todaySale = this.todaySale + sale.amount;
    //     this.todaySaleValue = this.todaySale.toFixed(2);
    //     this.todayPer =
    //       this.todayPer == Infinity
    //         ? 0
    //         : (100 * (this.todaySale - this.lastClose)) / this.lastClose;
    //     this.todayPerValue = this.todayPer.toFixed(2);
    //     if (this.todayPer >= 0) {
    //       this.todaySaleDown = false;
    //     } else {
    //       this.todaySaleDown = true;
    //     }
    //   }
    //   //getting yesterday's total sale data
    //   if (sale.date === yesterday) {
    //     this.lastClose = this.lastClose + sale.amount;
    //     this.lastCloseValue = this.lastClose.toFixed(2);
    //   }
    //   let month = sale.date.split("/ ", 2);
    //   //getting this Month's total sale data
    //   if (month[1] === thisMonth[1]) {
    //     this.monthlysale = this.monthlysale + sale.amount;
    //     this.monthlysaleValue = this.monthlysale.toFixed(2);

    //     if (sale.date === date) {
    //       // this.labels.forEach((avDate) => {
    //       //   if (avDate === sale.date) {
    //       //     console.log(":::: Working ::::" + sale.date);
    //       //   }
    //       // });
    //       this.data = this.data + sale.amount;
    //       // if (this.labels) console.log("work" + sale.date);
    //       this.dailysale.push(this.data);
    //       this.labels.push(sale.date);
    //     } else {
    //       this.dailysale.push(sale.amount);
    //       this.labels.push(sale.date);
    //       // console.log("work" + " " + 0);
    //     }
    //     // console.log(this.dailysale);
    //     // console.log(this.labels);
    //     this.monthPer =
    //       this.monthPer == Infinity
    //         ? 0
    //         : (100 * (this.monthlysale - this.lastMonth)) / this.lastMonth;
    //     // console.log("per " + this.monthPer);
    //     this.monthPerValue = this.monthPer.toFixed(2);
    //     if (this.monthPer >= 0) {
    //       this.monthSaleDown = false;
    //     } else {
    //       this.monthSaleDown = true;
    //     }
    //   }
    //   //getting last Month's total sale data
    //   if (month[1] === lastMonth) {
    //     this.lastMonth = this.lastMonth + sale.amount;
    //     this.lastMonthValue = this.lastMonth.toFixed(2);
    //   }
    // });
    // this.toCustomer = this.orders.customerData.length;
    this._fetchData();
    this.totalProfit = ((this.monthlysale * 40) / 100).toFixed(2);
  }

  ngOnInit() {}
  getDaysInMonth(month, year) {
    const date = new Date(year, month, 1);
    let today = new Date().getDate();
    const days = [];
    let idx = 0;
    while (date.getMonth() === month && idx < today) {
      const d = new Date(date);
      days.push(
        d.getDate() + " " + d.toLocaleString("en-us", { month: "short" })
      );
      date.setDate(date.getDate() + 1);
      idx += 1;
    }
    return days;
  }
  now = new Date();
  labels: any[] = [];
  monthRevenueAreaChart: MyChartType = {
    chart: {
      height: 282,
      type: "area",
      zoom: {
        enabled: false,
      },
    },
    tooltip: {
      theme: "dark",
      x: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 4,
    },
    series: [
      {
        name: "Revenue",
        data: this.dailysale,
      },
    ],
    dataLabels: {
      enabled: false,
    },
    zoom: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    colors: ["#43d39e"],
    xaxis: {
      type: "string",
      categories: this.labels,
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: true,
      },
    },
    yaxis: {
      labels: {
        formatter(val) {
          return val;
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [45, 100],
      },
    },
  };

  /**
   * fetches the dashboard value
   */
  private _fetchData() {
    this.revenueAreaChart = revenueAreaChart;
    this.targetsBarChart = targetsBarChart;
    this.salesDonutChart = salesDonutChart;
    this.ordersData = ordersData;
  }
}
