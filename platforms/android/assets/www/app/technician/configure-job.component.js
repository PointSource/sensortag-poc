System.register(['angular2/core', 'angular2/router', '../sensor.service', '../nav.service', './job.service', '../sensor.factory', '../sensor.component'], function(exports_1, context_1) {
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
    var core_1, router_1, sensor_service_1, nav_service_1, job_service_1, sensor_factory_1, sensor_component_1;
    var ConfigureJobComponent;
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
            function (nav_service_1_1) {
                nav_service_1 = nav_service_1_1;
            },
            function (job_service_1_1) {
                job_service_1 = job_service_1_1;
            },
            function (sensor_factory_1_1) {
                sensor_factory_1 = sensor_factory_1_1;
            },
            function (sensor_component_1_1) {
                sensor_component_1 = sensor_component_1_1;
            }],
        execute: function() {
            ConfigureJobComponent = (function () {
                function ConfigureJobComponent(_sensorService, _jobService, _navService, _routeParams, _elementRef, _jquery, _foundation, _sensorFactory) {
                    this._sensorService = _sensorService;
                    this._jobService = _jobService;
                    this._navService = _navService;
                    this._routeParams = _routeParams;
                    this._elementRef = _elementRef;
                    this._jquery = _jquery;
                    this._foundation = _foundation;
                    this._sensorFactory = _sensorFactory;
                }
                ConfigureJobComponent.prototype.ngOnInit = function () {
                    this.modalElement = this._jquery(this._elementRef.nativeElement.children[0]);
                    var elem = new this._foundation.Reveal(this.modalElement, { closeOnClick: false });
                    var policyNumber = this._routeParams.get('policyNumber');
                    this.job = this._jobService.getJob(policyNumber);
                    if (this.job === null) {
                        window.history.back();
                    }
                    this._navService.setTitle(this.job.name);
                    this.statusPercentage = 0;
                    this.sensors = [];
                    var savedSensors = this._sensorService.getSensorsForPolicy(policyNumber);
                    if (savedSensors.length > 0 && savedSensors[0].status === "DISCONNECTED") {
                        for (var _i = 0, savedSensors_1 = savedSensors; _i < savedSensors_1.length; _i++) {
                            var savedSensor = savedSensors_1[_i];
                            var sensor = this._sensorFactory.sensor(this.job.policyNumber);
                            sensor.setName(savedSensor.name);
                            sensor.setSystemId(savedSensor.systemId);
                            this.sensors.push(sensor);
                        }
                    }
                    else {
                        this.sensors = savedSensors;
                    }
                };
                ConfigureJobComponent.prototype.connectToNearestDevice = function () {
                    var self = this;
                    var sensor = this._sensorFactory.sensor(this.job.policyNumber);
                    sensor.connectToNearestDevice(function (sensor, status) {
                        self.statusHandler(sensor, status);
                    });
                };
                ConfigureJobComponent.prototype.statusHandler = function (sensor, status) {
                    if ('SCANNING' == status) {
                        this.modalElement.foundation('open');
                        this.statusPercentage = 20;
                    }
                    else if ('SENSORTAG_FOUND' == status) {
                        this.statusPercentage = 40;
                    }
                    else if ('CONNECTING' == status) {
                        this.statusPercentage = 60;
                    }
                    else if ('READING_DEVICE_INFO' == status) {
                        this.statusPercentage = 80;
                    }
                    else if ('DEVICE_INFO_AVAILABLE' == status) {
                        this.statusPercentage = 100;
                        this.deviceConnectedHandler(sensor);
                    }
                    else if ('SENSORTAG_NOT_FOUND' == status) {
                        this.statusPercentage = 0;
                    }
                    this.status = status;
                };
                ConfigureJobComponent.prototype.deviceConnectedHandler = function (sensor) {
                    this._sensorService.addSensor(sensor);
                    this.sensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);
                };
                ConfigureJobComponent.prototype.saveDevices = function () {
                    this._sensorService.sync();
                    window.history.back();
                };
                ConfigureJobComponent.prototype.nameSensor = function (sensorName) {
                    this.modalElement.foundation('close');
                    this.sensors[this.sensors.length - 1].name = "Sensor " + (this.sensors.length);
                    this.status = "";
                };
                // Handle device disconnected
                ConfigureJobComponent.prototype.deviceDisconnectedHandler = function (sensor) {
                    this._sensorService.removeSensor(sensor.systemId);
                    this.sensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);
                };
                ConfigureJobComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/technician/configure-job.component.html',
                        directives: [sensor_component_1.SensorComponent]
                    }),
                    __param(5, core_1.Inject('jQuery')),
                    __param(6, core_1.Inject('Foundation')), 
                    __metadata('design:paramtypes', [sensor_service_1.SensorService, job_service_1.JobService, nav_service_1.NavService, router_1.RouteParams, core_1.ElementRef, Object, Object, sensor_factory_1.SensorFactory])
                ], ConfigureJobComponent);
                return ConfigureJobComponent;
            }());
            exports_1("ConfigureJobComponent", ConfigureJobComponent);
        }
    }
});
//# sourceMappingURL=configure-job.component.js.map