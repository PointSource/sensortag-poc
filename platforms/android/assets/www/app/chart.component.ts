import {Component, Inject, OnInit, OnChanges, Input, SimpleChange, ElementRef} from 'angular2/core';


@Component({
    selector: 'chart-component',
    templateUrl: 'app/chart.component.html',
    inputs: ['data', 'ispercentage', 'multipledata']
})
export class ChartComponent implements OnInit, OnChanges {
    chart: any;
    data: any;
    multipledata: boolean;
    ispercentage: boolean;
    legendHtml: string;

    constructor(
        @Inject('ChartJS') private _chartJS,
        private myElement: ElementRef
    ) { }

    ngOnInit() {
        var colors = ["#49a7f7", "#ff7258", "#ffaa4b", "#327fbb", "#d0f100", "#9ad275"];

        if (this.multipledata) {
            let lineChartData = {
                datasets: []
            }

            let i = 0;
            for (let entry of this.data) {
                lineChartData.datasets.push({
                    label: entry.label,
                    strokeColor: colors[i],
                    pointColor: colors[i],
                    data: entry.data
                })

                i++;
            }


            var ctx = this.myElement.nativeElement.children[0].children[0].getContext("2d");

            if (this.ispercentage) {

                this.chart = new this._chartJS(ctx).Scatter(lineChartData, {
                    responsive: true,
                    bezierCurve: false,
                    scaleOverride: true,
                    scaleSteps: 10,
                    scaleStepWidth: 10,
                    scaleStartValue: 0,
                    scaleType: "date",
                    useUtc: false
                });
            } else {
                this.chart = new this._chartJS(ctx).Scatter(lineChartData, {
                    responsive: true,
                    bezierCurve: false,
                    scaleBeginAtZero: true,
                    scaleType: "date",
                    useUtc: false
                });
            }
        }

        else {
            let lineChartData = {
                labels: ["", "", "", "", "", "", "", "", "", ""],
                datasets: [
                    {
                        label: "Data",
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
        
        this.legendHtml = this.chart.generateLegend();
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