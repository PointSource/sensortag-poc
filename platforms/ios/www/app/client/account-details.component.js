System.register(['angular2/core', '../sensor.service', '../technician/job.service', '../technician/reading.service', '../nav.service', '../ble.service', '../sensor.factory', '../sensor.component'], function(exports_1, context_1) {
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
    var core_1, sensor_service_1, job_service_1, reading_service_1, nav_service_1, ble_service_1, sensor_factory_1, sensor_component_1;
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
            function (ble_service_1_1) {
                ble_service_1 = ble_service_1_1;
            },
            function (sensor_factory_1_1) {
                sensor_factory_1 = sensor_factory_1_1;
            },
            function (sensor_component_1_1) {
                sensor_component_1 = sensor_component_1_1;
            }],
        execute: function() {
            AccountDetailsComponent = (function () {
                function AccountDetailsComponent(_sensorService, _jobService, _bleService, _navService, _readingService, _evothings, _elementRef, _jquery, _foundation, _cordovaDevice, _sensorFactory) {
                    this._sensorService = _sensorService;
                    this._jobService = _jobService;
                    this._bleService = _bleService;
                    this._navService = _navService;
                    this._readingService = _readingService;
                    this._evothings = _evothings;
                    this._elementRef = _elementRef;
                    this._jquery = _jquery;
                    this._foundation = _foundation;
                    this._cordovaDevice = _cordovaDevice;
                    this._sensorFactory = _sensorFactory;
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
                    if (this.sensors.length > 0) {
                        this.scanForSensors();
                    }
                    else {
                        this.status = "No Sensors on Account";
                    }
                };
                AccountDetailsComponent.prototype.scanForSensors = function () {
                    this.modalElement.foundation('open');
                    this.connectedAddresses = [];
                    this._bleService.disconnectAllDevices();
                    this.status = "SCANNING";
                    this.scanIndex = 0;
                    this.setConnectCallbacks(this.sensors[this.scanIndex]);
                    this.sensors[this.scanIndex].scanForSensor();
                };
                AccountDetailsComponent.prototype.setConnectCallbacks = function (sensor) {
                    var self = this;
                    sensor.setOnDeviceConnected(function (device) {
                        self.onDeviceConnected(device);
                    });
                    sensor.setOnDeviceConnectFail(function (device) {
                        self.onDeviceConnectFail(device);
                    });
                };
                AccountDetailsComponent.prototype.clearConnectCallbacks = function (sensor) {
                    var self = this;
                    sensor.setOnDeviceConnected(function (device) {
                        if (self.connectedAddresses.indexOf(device.address) === -1) {
                            self.connectedAddresses.push(device.address);
                        }
                    });
                    sensor.setOnDeviceConnectFail(null);
                };
                AccountDetailsComponent.prototype.onDeviceConnected = function (device) {
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
                AccountDetailsComponent.prototype.onDeviceConnectFail = function (status) {
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
                AccountDetailsComponent.prototype.takeReading = function () {
                    this._sensorService.setClientSensors(this.sensors);
                    this._readingService.takeReading(this.sensors, this.job.policyNumber, true);
                };
                AccountDetailsComponent.prototype.cancel = function () {
                    this.modalElement.foundation('close');
                    window.history.back();
                };
                AccountDetailsComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/client/account-details.component.html',
                        directives: [sensor_component_1.SensorComponent]
                    }),
                    __param(5, core_1.Inject('Evothings')),
                    __param(7, core_1.Inject('jQuery')),
                    __param(8, core_1.Inject('Foundation')),
                    __param(9, core_1.Inject('CordovaDevice')), 
                    __metadata('design:paramtypes', [sensor_service_1.SensorService, job_service_1.JobService, ble_service_1.BLEService, nav_service_1.NavService, reading_service_1.ReadingService, Object, core_1.ElementRef, Object, Object, Object, sensor_factory_1.SensorFactory])
                ], AccountDetailsComponent);
                return AccountDetailsComponent;
            }());
            exports_1("AccountDetailsComponent", AccountDetailsComponent);
        }
    }
});
//# sourceMappingURL=account-details.component.js.map