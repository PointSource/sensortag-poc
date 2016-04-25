System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1;
    var ChartComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            ChartComponent = (function () {
                function ChartComponent(_chartJS, myElement) {
                    this._chartJS = _chartJS;
                    this.myElement = myElement;
                }
                ChartComponent.prototype.ngOnInit = function () {
                    var colors = ["#49a7f7", "#ff7258", "#ffaa4b", "#327fbb", "#d0f100", "#9ad275"];
                    if (this.multipledata) {
                        var lineChartData = {
                            datasets: []
                        };
                        var i = 0;
                        for (var _i = 0, _a = this.data; _i < _a.length; _i++) {
                            var entry = _a[_i];
                            lineChartData.datasets.push({
                                label: entry.label,
                                strokeColor: colors[i],
                                pointColor: colors[i],
                                data: entry.data
                            });
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
                        }
                        else {
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
                        var lineChartData = {
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
                        };
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
                        }
                        else {
                            this.chart = new this._chartJS(ctx).Line(lineChartData, {
                                responsive: true,
                                bezierCurve: false,
                                scaleBeginAtZero: true
                            });
                        }
                    }
                    this.legendHtml = this.chart.generateLegend();
                };
                ChartComponent.prototype.ngOnChanges = function (changes) {
                    if (this.chart) {
                        var index = 0;
                        for (var _i = 0, _a = this.chart.datasets[0].points; _i < _a.length; _i++) {
                            var point = _a[_i];
                            point.value = this.data[index];
                            index++;
                        }
                        this.chart.update();
                    }
                };
                ChartComponent = __decorate([
                    core_1.Component({
                        selector: 'chart-component',
                        templateUrl: 'app/chart.component.html',
                        inputs: ['data', 'ispercentage', 'multipledata']
                    }),
                    __param(0, core_1.Inject('ChartJS')), 
                    __metadata('design:paramtypes', [Object, core_1.ElementRef])
                ], ChartComponent);
                return ChartComponent;
            }());
            exports_1("ChartComponent", ChartComponent);
        }
    }
});
//# sourceMappingURL=chart.component.js.map