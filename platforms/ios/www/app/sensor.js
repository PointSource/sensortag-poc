System.register(['angular2/core', './ble.service'], function(exports_1, context_1) {
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
    var core_1, ble_service_1;
    var Sensor;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (ble_service_1_1) {
                ble_service_1 = ble_service_1_1;
            }],
        execute: function() {
            Sensor = (function () {
                function Sensor(_ngZone, 
                    // private _bleService: BLEService,
                    _evothings) {
                    this._ngZone = _ngZone;
                    this._evothings = _evothings;
                }
                Sensor.prototype.initialize = function (policyNumber) {
                    this._bleService = new ble_service_1.BLEService(this._evothings);
                    this.policyNumber = policyNumber;
                    // Create SensorTag CC2650 instance.
                    this.sensortag = this._evothings.tisensortag.createInstance(this._evothings.tisensortag.CC2650_BLUETOOTH_SMART);
                    this.data = {
                        humidityData: {
                            lastTenValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            relativeHumidity: 0
                        },
                        temperatureData: {
                            lastTenAmbient: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            lastTenTarget: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            ambientTemperature: 0,
                            targetTemperature: 0
                        },
                        keypressData: 0
                    };
                    this.name = "Sensor";
                    this.status = "DISCONNECTED";
                };
                Sensor.prototype.setName = function (name) {
                    this.name = name;
                };
                Sensor.prototype.setSystemId = function (systemId) {
                    this.systemId = systemId;
                };
                Sensor.prototype.connectToDevice = function (device) {
                    var self = this;
                    this.sensortag
                        .statusCallback(function (status) {
                        self._ngZone.run(function () {
                            self.initialStatusHandler(status);
                            if (self.onDeviceConnected && 'DEVICE_INFO_AVAILABLE' == status) {
                                self.onDeviceConnected(device);
                            }
                        });
                    })
                        .errorCallback(function (error) {
                        self._ngZone.run(function () {
                            self.errorHandler(error);
                        });
                    });
                    this.sensortag.connectToDevice(device);
                };
                Sensor.prototype.setOnDeviceConnected = function (callback) {
                    this.onDeviceConnected = callback;
                };
                Sensor.prototype.setOnDeviceConnectFail = function (callback) {
                    this.onDeviceConnectFail = callback;
                };
                Sensor.prototype.scanForSensor = function () {
                    var _this = this;
                    var self = this;
                    var foundAddresses = [];
                    var nonMatchingDevices = [];
                    var matchingDevice = null;
                    var numCompleted = 0;
                    console.log('Sensor.scanForSensor() ' + this.name.toUpperCase());
                    this._evothings.easyble.startScan(function (device) {
                        if (self._bleService.deviceIsSensorTag(device) && foundAddresses.indexOf(device.address) === -1) {
                            foundAddresses.push(device.address);
                            self._bleService.getSystemIdFromDevice(device, function (systemId, device) {
                                numCompleted++;
                                console.log("Sensor.scanForSensor() " + self.name.toUpperCase() + " success -- " + numCompleted + " completed out of " + foundAddresses.length);
                                if (self.systemId === systemId) {
                                    matchingDevice = device;
                                }
                                else {
                                    nonMatchingDevices.push({
                                        device: device,
                                        systemId: systemId
                                    });
                                }
                                // self.gotSystemId(systemId, device);
                                if (numCompleted === foundAddresses.length) {
                                    console.log("LAST ITEM");
                                    console.log("foundMatch?", (matchingDevice !== null));
                                    // Disconnect from all of the non matching devices
                                    for (var _i = 0, nonMatchingDevices_1 = nonMatchingDevices; _i < nonMatchingDevices_1.length; _i++) {
                                        var nonMatchingDevice = nonMatchingDevices_1[_i];
                                        console.log('Sensor.scanForSensor() disconnecting');
                                        nonMatchingDevice.device.close();
                                        nonMatchingDevice.device = null;
                                    }
                                    if (matchingDevice !== null) {
                                        console.log('Sensor.scanForSensor() matches!!');
                                        matchingDevice.close();
                                        self.connectToDevice(matchingDevice);
                                    }
                                    if (matchingDevice === null && self.onDeviceConnectFail) {
                                        self.onDeviceConnectFail('NO_MATCH');
                                    }
                                }
                            }, function () {
                                console.log("Sensor.scanForSensor() system id fail");
                                numCompleted++;
                                console.log("fail -- " + numCompleted + " completed out of " + foundAddresses.length);
                                self.onDeviceConnectFail('ERROR');
                            });
                        }
                    });
                    setTimeout(function () {
                        console.log("Stop Scanning " + self.name.toUpperCase() + " --- " + numCompleted + " completed out of " + foundAddresses.length);
                        _this._evothings.easyble.stopScan();
                        if (foundAddresses.length === 0 && self.onDeviceConnectFail) {
                            self._ngZone.run(function () {
                                self.onDeviceConnectFail("NO_SENSORS");
                            });
                        }
                    }, 1000);
                };
                Sensor.prototype.connectToNearestDevice = function (statusCallback) {
                    var self = this;
                    this.sensortag
                        .statusCallback(function (status) {
                        self._ngZone.run(function () {
                            self.initialStatusHandler(status);
                            statusCallback(self, status);
                        });
                    })
                        .errorCallback(function (error) {
                        self._ngZone.run(function () {
                            self.errorHandler(error);
                        });
                    });
                    this.sensortag.connectToNearestDevice();
                };
                Sensor.prototype.initialStatusHandler = function (status) {
                    console.log(this.name.toUpperCase() + " initial status = " + status);
                    if ('DEVICE_INFO_AVAILABLE' == status) {
                        this.deviceConnectedHandler();
                    }
                    this.status = status;
                };
                Sensor.prototype.deviceConnectedHandler = function () {
                    var self = this;
                    this.systemId = this.sensortag.getSystemId();
                    console.log('deviceConnectedHandler', this.systemId);
                    this.sensortag
                        .statusCallback(function (status) {
                        self._ngZone.run(function () {
                            self.statusHandler(status);
                        });
                    })
                        .humidityCallback(function (data) {
                        self._ngZone.run(function () {
                            self.humidityHandler(data);
                        });
                    }, 1000)
                        .temperatureCallback(function (data) {
                        self._ngZone.run(function () {
                            self.temperatureHandler(data);
                        });
                    }, 1000)
                        .keypressCallback(function (data) {
                        self._ngZone.run(function () {
                            self.keypressHandler(data);
                        });
                    });
                };
                Sensor.prototype.statusHandler = function (status) {
                    console.log(this.name.toUpperCase() + " status = " + status);
                    this.status = status;
                };
                Sensor.prototype.temperatureHandler = function (data) {
                    var values = this.sensortag.getTemperatureValues(data);
                    var af = this.sensortag.celsiusToFahrenheit(values.ambientTemperature);
                    var tf = this.sensortag.celsiusToFahrenheit(values.targetTemperature);
                    this.data.temperatureData.ambientTemperature = af.toFixed(1);
                    this.data.temperatureData.targetTemperature = tf.toFixed(1);
                    var lastTenAmbient = this.data.temperatureData.lastTenAmbient.slice();
                    lastTenAmbient.push(af);
                    lastTenAmbient.shift();
                    this.data.temperatureData.lastTenAmbient = lastTenAmbient;
                    var lastTenTarget = this.data.temperatureData.lastTenTarget.slice();
                    lastTenTarget.push(tf);
                    lastTenTarget.shift();
                    this.data.temperatureData.lastTenTarget = lastTenTarget;
                };
                Sensor.prototype.humidityHandler = function (data) {
                    var values = this.sensortag.getHumidityValues(data);
                    // Calculate the relative humidity.
                    var h = values.relativeHumidity;
                    this.data.humidityData.relativeHumidity = h.toFixed(1);
                    var lastTenValues = this.data.humidityData.lastTenValues.slice();
                    lastTenValues.push(h);
                    lastTenValues.shift();
                    this.data.humidityData.lastTenValues = lastTenValues;
                };
                Sensor.prototype.keypressHandler = function (data) {
                    this.data.keypressData = data[0];
                };
                Sensor.prototype.errorHandler = function (error) {
                    console.log('errorHandler', error);
                    if (this._evothings.easyble.error.DISCONNECTED == error) {
                    }
                    this.status = 'ERROR';
                };
                Sensor = __decorate([
                    __param(1, core_1.Inject('Evothings')), 
                    __metadata('design:paramtypes', [core_1.NgZone, Object])
                ], Sensor);
                return Sensor;
            }());
            exports_1("Sensor", Sensor);
        }
    }
});
//# sourceMappingURL=sensor.js.map