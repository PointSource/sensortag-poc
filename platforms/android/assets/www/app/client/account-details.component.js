System.register(['angular2/core', '../sensor.service', '../technician/job.service', '../technician/reading.service', '../nav.service', '../sensor.factory', '../sensor.component', '../scan.component'], function(exports_1, context_1) {
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
    var core_1, sensor_service_1, job_service_1, reading_service_1, nav_service_1, sensor_factory_1, sensor_component_1, scan_component_1;
    var AccountDetailsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (sensor_service_1_1) {
                sensor_service_1 = sensor_service_1_1;
            },
            function (job_service_1_1) {
                job_service_1 = job_service_1_1;
            },
            function (reading_service_1_1) {
                reading_service_1 = reading_service_1_1;
            },
            function (nav_service_1_1) {
                nav_service_1 = nav_service_1_1;
            },
            function (sensor_factory_1_1) {
                sensor_factory_1 = sensor_factory_1_1;
            },
            function (sensor_component_1_1) {
                sensor_component_1 = sensor_component_1_1;
            },
            function (scan_component_1_1) {
                scan_component_1 = scan_component_1_1;
            }],
        execute: function() {
            AccountDetailsComponent = (function () {
                function AccountDetailsComponent(_sensorService, _jobService, _navService, _readingService, _elementRef, _sensorFactory, _jquery, _foundation) {
                    this._sensorService = _sensorService;
                    this._jobService = _jobService;
                    this._navService = _navService;
                    this._readingService = _readingService;
                    this._elementRef = _elementRef;
                    this._sensorFactory = _sensorFactory;
                    this._jquery = _jquery;
                    this._foundation = _foundation;
                }
                AccountDetailsComponent.prototype.ngOnInit = function () {
                    this.modalElement = this._jquery(this._elementRef.nativeElement.children[0]);
                    new this._foundation.Reveal(this.modalElement, { closeOnClick: false });
                    this.connectedAddresses = [];
                    this.sensors = [];
                    this._navService.setTitle("My Sensors");
                    // If client sensors have not been loaded, ask the user for their policy
                    // number so you can load the sensors.
                    if (this._sensorService.clientSensors.length === 0) {
                        this.modalElement.foundation('open');
                    }
                    else {
                        this.sensors = this._sensorService.getClientSensors();
                        var job = this._jobService.getJob(this.sensors[0].policyNumber);
                        if (job === undefined) {
                            this.status = "ERROR";
                        }
                        else {
                            this.job = job;
                            for (var _i = 0, _a = this.sensors; _i < _a.length; _i++) {
                                var sensor = _a[_i];
                                this.connectedAddresses.push(sensor.systemId);
                            }
                        }
                    }
                };
                AccountDetailsComponent.prototype.findAccount = function (policyNumber) {
                    var job = this._jobService.getJob(policyNumber);
                    if (job === undefined) {
                        this.status = "ERROR";
                    }
                    else {
                        this.job = job;
                        this.loadSensors();
                    }
                };
                AccountDetailsComponent.prototype.loadSensors = function () {
                    var self = this;
                    var savedSensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);
                    for (var _i = 0, savedSensors_1 = savedSensors; _i < savedSensors_1.length; _i++) {
                        var savedSensor = savedSensors_1[_i];
                        var sensor = this._sensorFactory.sensor(this.job.policyNumber);
                        sensor.setName(savedSensor.name);
                        sensor.setSystemId(savedSensor.systemId);
                        this.sensors.push(sensor);
                    }
                    this.modalElement.foundation('close');
                    if (this.sensors.length === 0) {
                        this.status = "No Sensors on Account";
                    }
                };
                AccountDetailsComponent.prototype.connectionCompleteHandler = function ($event) {
                    this.allSensorsConnected = $event.allSensorsConnected;
                    if (this.allSensorsConnected) {
                        this._sensorService.setClientSensors(this.sensors);
                    }
                };
                AccountDetailsComponent.prototype.cancel = function () {
                    this.modalElement.foundation('close');
                    window.history.back();
                };
                AccountDetailsComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/client/account-details.component.html',
                        directives: [sensor_component_1.SensorComponent, scan_component_1.ScanComponent]
                    }),
                    __param(6, core_1.Inject('jQuery')),
                    __param(7, core_1.Inject('Foundation')), 
                    __metadata('design:paramtypes', [sensor_service_1.SensorService, job_service_1.JobService, nav_service_1.NavService, reading_service_1.ReadingService, core_1.ElementRef, sensor_factory_1.SensorFactory, Object, Object])
                ], AccountDetailsComponent);
                return AccountDetailsComponent;
            }());
            exports_1("AccountDetailsComponent", AccountDetailsComponent);
        }
    }
});
//# sourceMappingURL=account-details.component.js.map