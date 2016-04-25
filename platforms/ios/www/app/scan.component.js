System.register(['angular2/core', './ble.service', './technician/reading.service'], function(exports_1, context_1) {
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
    var core_1, ble_service_1, reading_service_1;
    var ScanComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (ble_service_1_1) {
                ble_service_1 = ble_service_1_1;
            },
            function (reading_service_1_1) {
                reading_service_1 = reading_service_1_1;
            }],
        execute: function() {
            ScanComponent = (function () {
                function ScanComponent(myElement, _bleService, _readingService, _cordovaDevice, _elementRef, _jquery, _foundation) {
                    this.myElement = myElement;
                    this._bleService = _bleService;
                    this._readingService = _readingService;
                    this._cordovaDevice = _cordovaDevice;
                    this._elementRef = _elementRef;
                    this._jquery = _jquery;
                    this._foundation = _foundation;
                    this.onConnectionComplete = new core_1.EventEmitter();
                }
                ScanComponent.prototype.ngOnInit = function () {
                    this.modalElement = this._jquery(this._elementRef.nativeElement.children[0]);
                    new this._foundation.Reveal(this.modalElement, { closeOnClick: false });
                    this.connectedAddresses = [];
                    if (this.sensors.length > 0 && this.sensors[0].status !== "DISCONNECTED") {
                        for (var _i = 0, _a = this.sensors; _i < _a.length; _i++) {
                            var sensor = _a[_i];
                            this.connectedAddresses.push(sensor.systemId);
                        }
                    }
                };
                // SCAN FOR SENSORS
                ScanComponent.prototype.scanForSensors = function () {
                    this.modalElement.foundation('open');
                    this.connectedAddresses = [];
                    this._bleService.disconnectAllDevices();
                    this.status = "SCANNING";
                    this.scanIndex = 0;
                    this.setConnectCallbacks(this.sensors[this.scanIndex]);
                    this.sensors[this.scanIndex].scanForSensor();
                };
                ScanComponent.prototype.setConnectCallbacks = function (sensor) {
                    var _this = this;
                    sensor.setOnDeviceConnected(function (device) {
                        _this.onDeviceConnected(device);
                    });
                    sensor.setOnDeviceConnectFail(function (device) {
                        _this.onDeviceConnectFail(device);
                    });
                };
                ScanComponent.prototype.clearConnectCallbacks = function (sensor) {
                    var _this = this;
                    sensor.setOnDeviceConnected(function (device) {
                        if (_this.connectedAddresses.indexOf(device.address) === -1) {
                            _this.connectedAddresses.push(device.address);
                        }
                    });
                    sensor.setOnDeviceConnectFail(null);
                };
                ScanComponent.prototype.onDeviceConnected = function (device) {
                    var _this = this;
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
                        console.log("success emit");
                        this.onConnectionComplete.emit({ allSensorsConnected: this.connectedAddresses.length === this.sensors.length });
                    }
                };
                ScanComponent.prototype.onDeviceConnectFail = function (status) {
                    var _this = this;
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
                            console.log("FAIL emit");
                            this.onConnectionComplete.emit({ allSensorsConnected: this.connectedAddresses.length === this.sensors.length });
                        }
                    }
                };
                ScanComponent.prototype.takeReading = function () {
                    this._readingService.takeReading(this.sensors, this.job.policyNumber, this.isClient);
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], ScanComponent.prototype, "onConnectionComplete", void 0);
                ScanComponent = __decorate([
                    core_1.Component({
                        selector: 'scanner-component',
                        templateUrl: 'app/scan.component.html',
                        inputs: ['sensors', 'job', 'isClient']
                    }),
                    __param(3, core_1.Inject('CordovaDevice')),
                    __param(5, core_1.Inject('jQuery')),
                    __param(6, core_1.Inject('Foundation')), 
                    __metadata('design:paramtypes', [core_1.ElementRef, ble_service_1.BLEService, reading_service_1.ReadingService, Object, core_1.ElementRef, Object, Object])
                ], ScanComponent);
                return ScanComponent;
            }());
            exports_1("ScanComponent", ScanComponent);
        }
    }
});
//# sourceMappingURL=scan.component.js.map