System.register(['angular2/core', './sensor.service', 'angular2/router', './chart.component'], function(exports_1, context_1) {
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
    var core_1, sensor_service_1, router_1, chart_component_1;
    var SensorDetailComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (sensor_service_1_1) {
                sensor_service_1 = sensor_service_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (chart_component_1_1) {
                chart_component_1 = chart_component_1_1;
            }],
        execute: function() {
            SensorDetailComponent = (function () {
                function SensorDetailComponent(_routeParams, _sensorService) {
                    this._routeParams = _routeParams;
                    this._sensorService = _sensorService;
                }
                SensorDetailComponent.prototype.ngOnInit = function () {
                    var systemId = this._routeParams.get('systemId');
                    this.device = this._sensorService.getSensor(systemId);
                };
                SensorDetailComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/sensor-detail.component.html',
                        directives: [chart_component_1.ChartComponent]
                    }), 
                    __metadata('design:paramtypes', [router_1.RouteParams, sensor_service_1.SensorService])
                ], SensorDetailComponent);
                return SensorDetailComponent;
            }());
            exports_1("SensorDetailComponent", SensorDetailComponent);
        }
    }
});
//# sourceMappingURL=sensor-detail.component.js.map