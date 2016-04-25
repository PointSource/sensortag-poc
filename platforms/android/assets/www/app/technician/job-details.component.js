System.register(['angular2/core', 'angular2/router', './job.service', '../sensor.service', '../sensor.factory', './reading.service', '../nav.service', '../scan.component', '../chart.component'], function(exports_1, context_1) {
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
    var core_1, router_1, router_2, job_service_1, sensor_service_1, sensor_factory_1, reading_service_1, nav_service_1, scan_component_1, chart_component_1;
    var JobDetailsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
                router_2 = router_1_1;
            },
            function (job_service_1_1) {
                job_service_1 = job_service_1_1;
            },
            function (sensor_service_1_1) {
                sensor_service_1 = sensor_service_1_1;
            },
            function (sensor_factory_1_1) {
                sensor_factory_1 = sensor_factory_1_1;
            },
            function (reading_service_1_1) {
                reading_service_1 = reading_service_1_1;
            },
            function (nav_service_1_1) {
                nav_service_1 = nav_service_1_1;
            },
            function (scan_component_1_1) {
                scan_component_1 = scan_component_1_1;
            },
            function (chart_component_1_1) {
                chart_component_1 = chart_component_1_1;
            }],
        execute: function() {
            JobDetailsComponent = (function () {
                function JobDetailsComponent(_router, _routeParams, _jobService, _sensorService, _sensorFactory, _readingService, _navService) {
                    this._router = _router;
                    this._routeParams = _routeParams;
                    this._jobService = _jobService;
                    this._sensorService = _sensorService;
                    this._sensorFactory = _sensorFactory;
                    this._readingService = _readingService;
                    this._navService = _navService;
                    this.readings = [];
                }
                JobDetailsComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    var policyNumber = this._routeParams.get('policyNumber');
                    this.job = this._jobService.getJob(policyNumber);
                    if (this.job === null) {
                        window.history.back();
                    }
                    this._navService.setTitle(this.job.name);
                    this._navService.setBack(function () {
                        _this._router.navigate(['JobList', {}]);
                    });
                    this.readings = [];
                    this.sensors = [];
                    var savedSensors = this._sensorService.getSensorsForPolicy(policyNumber);
                    if (savedSensors.length > 0 && savedSensors[0].status === "DISCONNECTED") {
                        for (var _i = 0, savedSensors_1 = savedSensors; _i < savedSensors_1.length; _i++) {
                            var savedSensor = savedSensors_1[_i];
                            var sensor = this._sensorFactory.sensor(this.job.policyNumber);
                            sensor.setName(savedSensor.name);
                            sensor.setSystemId(savedSensor.systemId);
                            this.sensors.push(sensor);
                            this._sensorService.replaceSensor(sensor);
                        }
                    }
                    else {
                        this.sensors = savedSensors;
                        this.allSensorsConnected = true;
                    }
                    this.loadReadings();
                };
                JobDetailsComponent.prototype.loadReadings = function () {
                    var _this = this;
                    this._readingService.fetch().add(function () {
                        _this.readings = _this._readingService.getReadingsForPolicy(_this.job.policyNumber);
                    });
                };
                JobDetailsComponent.prototype.goToConfigureJob = function (policyNumber) {
                    this._router.navigate(['ConfigureJob', { policyNumber: this.job.policyNumber }]);
                };
                JobDetailsComponent.prototype.goToReadingDetails = function (type) {
                    this._router.navigate(['ReadingHistory', { policyNumber: this.job.policyNumber, type: type }]);
                };
                JobDetailsComponent.prototype.connectionCompleteHandler = function ($event) {
                    this.allSensorsConnected = $event.allSensorsConnected;
                };
                JobDetailsComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/technician/job-details.component.html',
                        styleUrls: ['app/technician/job-details.component.css'],
                        directives: [scan_component_1.ScanComponent, chart_component_1.ChartComponent]
                    }), 
                    __metadata('design:paramtypes', [router_2.Router, router_1.RouteParams, job_service_1.JobService, sensor_service_1.SensorService, sensor_factory_1.SensorFactory, reading_service_1.ReadingService, nav_service_1.NavService])
                ], JobDetailsComponent);
                return JobDetailsComponent;
            }());
            exports_1("JobDetailsComponent", JobDetailsComponent);
        }
    }
});
//# sourceMappingURL=job-details.component.js.map