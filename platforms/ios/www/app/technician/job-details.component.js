System.register(['angular2/core', 'angular2/router', './job.service', '../sensor.service', '../sensor.factory', './reading.service', '../nav.service', '../ble.service'], function(exports_1, context_1) {
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
    var core_1, router_1, router_2, job_service_1, sensor_service_1, sensor_factory_1, reading_service_1, nav_service_1, ble_service_1;
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
            function (ble_service_1_1) {
                ble_service_1 = ble_service_1_1;
            }],
        execute: function() {
            JobDetailsComponent = (function () {
                function JobDetailsComponent(_router, _routeParams, _bleService, _jobService, _sensorService, _sensorFactory, _readingService, _cordovaDevice, _navService, _elementRef, _jquery, _foundation) {
                    this._router = _router;
                    this._routeParams = _routeParams;
                    this._bleService = _bleService;
                    this._jobService = _jobService;
                    this._sensorService = _sensorService;
                    this._sensorFactory = _sensorFactory;
                    this._readingService = _readingService;
                    this._cordovaDevice = _cordovaDevice;
                    this._navService = _navService;
                    this._elementRef = _elementRef;
                    this._jquery = _jquery;
                    this._foundation = _foundation;
                    this.readings = [];
                }
                JobDetailsComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this.modalElement = this._jquery(this._elementRef.nativeElement.children[0]);
                    new this._foundation.Reveal(this.modalElement, { closeOnClick: false });
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
                    this.connectedAddresses = [];
                    // this.sensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);
                    var savedSensors = this._sensorService.getSensorsForPolicy(policyNumber);
                    console.log('savedSensors', savedSensors);
                    console.log('policyNumber', policyNumber);
                    if (savedSensors.length > 0 && savedSensors[0].data === undefined) {
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
                        for (var _a = 0, _b = this.sensors; _a < _b.length; _a++) {
                            var sensor_1 = _b[_a];
                            this.connectedAddresses.push(sensor_1.systemId);
                        }
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
                JobDetailsComponent.prototype.takeReading = function () {
                    this.readings = this._readingService.takeReading(this.sensors, this.job.policyNumber, false);
                };
                JobDetailsComponent.prototype.goToReadingDetails = function (type) {
                    this._router.navigate(['ReadingHistory', { policyNumber: this.job.policyNumber, type: type }]);
                };
                // SCAN FOR SENSORS
                JobDetailsComponent.prototype.scanForSensors = function () {
                    this.modalElement.foundation('open');
                    this.connectedAddresses = [];
                    this._bleService.disconnectAllDevices();
                    this.status = "SCANNING";
                    this.scanIndex = 0;
                    this.setConnectCallbacks(this.sensors[this.scanIndex]);
                    this.sensors[this.scanIndex].scanForSensor();
                };
                JobDetailsComponent.prototype.setConnectCallbacks = function (sensor) {
                    var self = this;
                    sensor.setOnDeviceConnected(function (device) {
                        self.onDeviceConnected(device);
                    });
                    sensor.setOnDeviceConnectFail(function (device) {
                        self.onDeviceConnectFail(device);
                    });
                };
                JobDetailsComponent.prototype.clearConnectCallbacks = function (sensor) {
                    var self = this;
                    sensor.setOnDeviceConnected(function (device) {
                        if (self.connectedAddresses.indexOf(device.address) === -1) {
                            self.connectedAddresses.push(device.address);
                        }
                    });
                    sensor.setOnDeviceConnectFail(null);
                };
                JobDetailsComponent.prototype.onDeviceConnected = function (device) {
                    var _this = this;
                    var self = this;
                    // Connect to the next device if this device is not already connected... ?
                    if (this.connectedAddresses.indexOf(device.address) === -1) {
                        this.connectedAddresses.push(device.address);
                    }
                    if ((this.scanIndex + 1) < this.sensors.length) {
                        this.clearConnectCallbacks(this.sensors[this.scanIndex]);
                        this.scanIndex++;
                        this.setConnectCallbacks(this.sensors[this.scanIndex]);
                        // Have to timeout on iOS to wait for devices to disconnect
                        if (this._cordovaDevice.platform === "iOS") {
                            console.log('CONNECT set timeout', this._cordovaDevice.platform);
                            setTimeout(function () {
                                console.log('CONNECT resolve timeout');
                                _this.sensors[_this.scanIndex].scanForSensor();
                            }, 10000);
                        }
                        else {
                            this.sensors[this.scanIndex].scanForSensor();
                        }
                    }
                    else {
                        this.clearConnectCallbacks(this.sensors[this.scanIndex]);
                        this.status = "DONE_CONNECTING";
                    }
                };
                JobDetailsComponent.prototype.onDeviceConnectFail = function (status) {
                    var _this = this;
                    var self = this;
                    console.log('on device connect fail', status);
                    if ((this.scanIndex + 1) < this.sensors.length && status !== "NO_SENSORS") {
                        this.clearConnectCallbacks(this.sensors[this.scanIndex]);
                        this.scanIndex++;
                        this.setConnectCallbacks(this.sensors[this.scanIndex]);
                        // Have to timeout on iOS to wait for devices to disconnect
                        if (this._cordovaDevice.platform === "iOS") {
                            console.log('FAIL set timeout', this._cordovaDevice.platform);
                            setTimeout(function () {
                                console.log('FAIL resolve timeout');
                                _this.sensors[_this.scanIndex].scanForSensor();
                            }, 10000);
                        }
                        else {
                            this.sensors[this.scanIndex].scanForSensor();
                        }
                    }
                    else {
                        if (status === "NO_SENSORS" && this.connectedAddresses.length === 0) {
                            this.status = status;
                        }
                        else {
                            this.clearConnectCallbacks(this.sensors[this.scanIndex]);
                            this.scanIndex++;
                            this.status = "DONE_CONNECTING";
                        }
                    }
                };
                JobDetailsComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/technician/job-details.component.html',
                        styleUrls: ['app/technician/job-details.component.css']
                    }),
                    __param(7, core_1.Inject('CordovaDevice')),
                    __param(10, core_1.Inject('jQuery')),
                    __param(11, core_1.Inject('Foundation')), 
                    __metadata('design:paramtypes', [router_2.Router, router_1.RouteParams, ble_service_1.BLEService, job_service_1.JobService, sensor_service_1.SensorService, sensor_factory_1.SensorFactory, reading_service_1.ReadingService, Object, nav_service_1.NavService, core_1.ElementRef, Object, Object])
                ], JobDetailsComponent);
                return JobDetailsComponent;
            }());
            exports_1("JobDetailsComponent", JobDetailsComponent);
        }
    }
});
//# sourceMappingURL=job-details.component.js.map