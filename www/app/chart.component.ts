import {Component, Inject, OnInit, OnChanges, Input, SimpleChange} from 'angular2/core';


@Component({selector: 'chart-component',
    templateUrl: 'app/chart.component.html',
    inputs: ['data']
})
export class ChartComponent implements OnInit, OnChanges {
    chart: any;

    constructor(
        @Inject('ChartJS') private _chartJS
    ) { }

    ngOnInit() {
        var lineChartData = {
            labels: ["-", "-", "-", "-", "-", "-", "-", "-", "-", "-"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                }
            ]
        }

        var ctx = document.getElementById("canvas").getContext("2d");
        this.chart = new this._chartJS(ctx).Line(lineChartData, {
            responsive: true,
            bezierCurve: false
        });

    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        console.log('ngOnChanges - myProp = ' + changes['data'].currentValue);

        if (this.chart) {
            this.chart.addData([changes['data'].currentValue]);
            this.chart.removeData();
        }
    }

}