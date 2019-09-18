import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  LineChart = [];
  BarChart = [];
  PieChart = [];
  monthlyChartData = { datasets: [] };
  UtilizationDataLabels = ['Monthly Sold', 'Monthly Purchase'];
  UtilizationDataReports = [];
  displayColors = ['lightcyan', '#d0fbd0', 'lightgray', '#b4e2ff', 'lightyellow', 'red', 'blue', 'green', 'pink', 'gray', 'yellow', 'maroon'];
  gradientImage = ['linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1))'];
  labels = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'August', 'Sep', 'Oct', 'Nov', 'Dec'];
  appliedColors = [];
  imglineChartSrc: string = '';

  constructor() { }

  ngOnInit() {
    this.buildGraph();
  }

  lineChartDone() {
    // const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
    // console.log(canvas);
    // canvas.toBlob(function (blob) {
    //   console.log(blob);
    //   this.imglineChartSrc = URL.createObjectURL(blob);
    // });
  }

  buildGraph() {
    const data = [9, 7, 3, 5, 2, 10, 15, 16, 19, 3, 20, 9];
    const Otherdata = [6, 5, 9, 4, 8, 11, 3, 17, 2, 7, 1, 15];
    this.UtilizationDataReports.push(data);
    this.UtilizationDataReports.push(Otherdata);
    this.LineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          label: 'No of items sold in months',
          data,
          fill: false,
          lineTension: 0.2,
          borderColor: 'lightblue',
          borderWidth: 1,
          backgroundColor: 'linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1))',
          pointBackgroundColor: 'rgba(148,159,177,1)',
          pointBorderColor: '#fff',
        }],

      },
      options: {
        title: {
          text: 'Line Chart',
          display: true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        animation: {
          onComplete: this.lineChartDone
        }
      },
    });




    for (let i = 0; i < data.length; i++) {
      this.appliedColors.push(this.displayColors[i]);
    }

    for (let i = 0; i < this.UtilizationDataLabels.length; i++) {
      this.monthlyChartData.datasets.push({
        label: this.UtilizationDataLabels[i],
        backgroundColor: '',
        borderColor: '',
        backgroundImage: '',
        data: this.UtilizationDataReports[i],
      });
      this.monthlyChartData.datasets[i].backgroundColor = this.appliedColors[i];
      this.monthlyChartData.datasets[i].backgroundImage = this.gradientImage[i];
    }
    this.BarChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: this.monthlyChartData.datasets,
      },
      options: {
        title: {
          text: 'Bar Chart',
          display: true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      },
    });

    this.PieChart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [{
          data,
          backgroundColor: this.appliedColors,
          borderColor: this.appliedColors,
        }],
      },
      options: {
        title: {
          text: 'Pie Chart',
          display: true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

}
