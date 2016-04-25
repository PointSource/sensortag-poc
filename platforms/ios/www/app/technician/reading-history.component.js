System.register(['angular2/core', 'angular2/router', '../nav.service', './reading.service', '../sensor.service', '../chart.component'], function(exports_1, context_1) {
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
    var core_1, router_1, router_2, nav_service_1, reading_service_1, sensor_service_1, chart_component_1;
    var ReadingHistoryComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
                router_2 = router_1_1;
            },
            function (nav_service_1_1) {
                nav_service_1 = nav_service_1_1;
            },
            function (reading_service_1_1) {
                reading_service_1 = reading_service_1_1;
            },
            function (sensor_service_1_1) {
                sensor_service_1 = sensor_service_1_1;
            },
            function (chart_component_1_1) {
                chart_component_1 = chart_component_1_1;
            }],
        execute: function() {
            ReadingHistoryComponent = (function () {
                function ReadingHistoryComponent(_router, _routeParams, _readingService, _navService, _sensorService) {
                    this._router = _router;
                    this._routeParams = _routeParams;
                    this._readingService = _readingService;
                    this._navService = _navService;
                    this._sensorService = _sensorService;
                    this.lastTenReadings = [];
                }
                ReadingHistoryComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    var policyNumber = this._routeParams.get('policyNumber');
                    this.type = this._routeParams.get('type');
                    this._navService.setBack(function () {
                        _this._router.navigate(['JobDetails', { policyNumber: policyNumber }]);
                    });
                    this.readings = this._readingService.getReadingsForPolicy(policyNumber);
                    var readingsBySensor = {};
                    if (this.type === "humidity") {
                        this.title = "Humidity";
                    }
                    else if (this.type === "targetTemperature") {
                        this.title = "Target Temperature";
                    }
                    else if (this.type === "ambientTemperature") {
                        this.title = "Ambient Temperature";
                    }
                    for (var _i = 0, _a = this.readings; _i < _a.length; _i++) {
                        var reading = _a[_i];
                        for (var _b = 0, _c = reading.sensorData; _b < _c.length; _b++) {
                            var sensorData = _c[_b];
                            if (!readingsBySensor[sensorData.systemId]) {
                                readingsBySensor[sensorData.systemId] = {
                                    label: this._sensorService.getSensor(sensorData.systemId).name,
                                    data: []
                                };
                            }
                            var dataPoint = 0;
                            if (this.type === "humidity") {
                                dataPoint = sensorData.data.humidityData.relativeHumidity;
                            }
                            else if (this.type === "targetTemperature") {
                                dataPoint = sensorData.data.temperatureData.targetTemperature;
                            }
                            else if (this.type === "ambientTemperature") {
                                dataPoint = sensorData.data.temperatureData.ambientTemperature;
                            }
                            readingsBySensor[sensorData.systemId].data.push({
                                x: new Date(reading.date),
                                y: dataPoint,
                                r: reading.isClient ? 2 : 1
                            });
                        }
                    }
                    var readingKeys = Object.keys(readingsBySensor);
                    for (var _d = 0, readingKeys_1 = readingKeys; _d < readingKeys_1.length; _d++) {
                        var key = readingKeys_1[_d];
                        this.lastTenReadings.push(readingsBySensor[key]);
                    }
                };
                ReadingHistoryComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/technician/reading-history.component.html',
                        directives: [chart_component_1.ChartComponent]
                    }), 
                    __metadata('design:paramtypes', [router_2.Router, router_1.RouteParams, reading_service_1.ReadingService, nav_service_1.NavService, sensor_service_1.SensorService])
                ], ReadingHistoryComponent);
                return ReadingHistoryComponent;
            }());
            exports_1("ReadingHistoryComponent", ReadingHistoryComponent);
        }
    }
});
//# sourceMappingURL=reading-history.component.js.map