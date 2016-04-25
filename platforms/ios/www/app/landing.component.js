System.register(['angular2/core', 'angular2/router', './sensor.service', './technician/reading.service', './nav.service', './ble.service'], function(exports_1, context_1) {
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
    var core_1, router_1, sensor_service_1, reading_service_1, nav_service_1, ble_service_1;
    var LandingComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (sensor_service_1_1) {
                sensor_service_1 = sensor_service_1_1;
            },
            function (reading_service_1_1) {
                reading_service_1 = reading_service_1_1;
            },
            function (nav_service_1_1) {
                nav_service_1 = nav_service_1_1;
            },
            function (ble_service_1_1) {
                ble_service_1 = ble_service_1_1;
            }],
        execute: function() {
            LandingComponent = (function () {
                function LandingComponent(_sensorService, _readingService, _router, _navService, _bleService) {
                    this._sensorService = _sensorService;
                    this._readingService = _readingService;
                    this._router = _router;
                    this._navService = _navService;
                    this._bleService = _bleService;
                }
                LandingComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.loadingComplete = false;
                    this._navService.setTitle("Sensor Demo");
                    if (this._sensorService.sensors.length === 0) {
                        this._sensorService.fetch().add(function () {
                            _this._readingService.fetch().add(function () {
                                _this.loadingComplete = true;
                            });
                        });
                    }
                    else {
                        this.loadingComplete = true;
                    }
                };
                LandingComponent.prototype.goToTechnician = function () {
                    this._router.navigate(['JobList', {}]);
                };
                LandingComponent.prototype.goToClient = function () {
                    this._router.navigate(['AccountDetails', {}]);
                };
                LandingComponent.prototype.disconnect = function () {
                    this._bleService.disconnectAllDevices();
                    this._sensorService.setClientSensors([]);
                };
                LandingComponent.prototype.reset = function () {
                    var _this = this;
                    this.loadingComplete = false;
                    this._sensorService.reset().add(function () {
                        _this._readingService.reset().add(function () {
                            _this._sensorService.fetch().add(function () {
                                _this._readingService.fetch().add(function () {
                                    _this.loadingComplete = true;
                                    _this._bleService.disconnectAllDevices();
                                    _this._sensorService.setClientSensors([]);
                                });
                            });
                        });
                    });
                };
                LandingComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/landing.component.html'
                    }), 
                    __metadata('design:paramtypes', [sensor_service_1.SensorService, reading_service_1.ReadingService, router_1.Router, nav_service_1.NavService, ble_service_1.BLEService])
                ], LandingComponent);
                return LandingComponent;
            }());
            exports_1("LandingComponent", LandingComponent);
        }
    }
});
//# sourceMappingURL=landing.component.js.map