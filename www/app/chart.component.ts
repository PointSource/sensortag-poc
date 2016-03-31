import {Component, Inject, OnInit, OnChanges, Input, SimpleChange} from 'angular2/core';


@Component({selector: 'chart-component',
    templateUrl: 'app/chart.component.html',
    inputs: ['data']
})
export class ChartComponent implements OnInit, OnChanges {
    chart: any;
    data: any;

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
                    data: this.data
                }
            ]
        }

        var ctx = document.getElementById("canvas").getContext("2d");
        this.chart = new this._chartJS(ctx).Line(lineChartData, {
            responsive: true,
            bezierCurve: false,
            scaleOverride: true,
            scaleSteps: 10,
            scaleStepWidth: 10,
            scaleStartValue: 0 
        });

    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }) {
        if (this.chart) {
            var index = 0;
            for (var point of this.chart.datasets[0].points) {
                point.value = this.data[index];
                index++;
            }
            this.chart.update();
        }
    }

}