import {Component, Inject, OnInit, OnChanges, Input, SimpleChange, ElementRef} from 'angular2/core';


@Component({
    selector: 'chart-component',
    templateUrl: 'app/chart.component.html',
    inputs: ['data', 'ispercentage']
})
export class ChartComponent implements OnInit, OnChanges {
    chart: any;
    data: any;
    ispercentage: boolean;

    constructor(
        @Inject('ChartJS') private _chartJS,
        private myElement: ElementRef
    ) { }

    ngOnInit() {
        var lineChartData = {
            labels: ["", "", "", "", "", "", "", "", "", ""],
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

        var ctx = this.myElement.nativeElement.children[0].children[0].getContext("2d");

        if (this.ispercentage) {

            this.chart = new this._chartJS(ctx).Line(lineChartData, {
                responsive: true,
                bezierCurve: false,
                scaleOverride: true,
                scaleSteps: 10,
                scaleStepWidth: 10,
                scaleStartValue: 0 
            });
        } else {
            this.chart = new this._chartJS(ctx).Line(lineChartData, {
                responsive: true,
                bezierCurve: false,
                scaleBeginAtZero : true
            });
        }
            
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