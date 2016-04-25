System.register(['angular2/core'], function(exports_1, context_1) {
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
    var core_1;
    var SensorClass;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            SensorClass = (function () {
                function SensorClass(_ngZone, _evothings) {
                    this._ngZone = _ngZone;
                    this._evothings = _evothings;
                }
                SensorClass.prototype.initialize = function (policyNumber, name) {
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
                    this.name = name ? name : "Sensor";
                    this.status = "initializing";
                };
                SensorClass.prototype.connectToDevice = function (device) {
                    var self = this;
                    this.sensortag
                        .statusCallback(function (status) {
                        self._ngZone.run(function () {
                            self.initialStatusHandler(status);
                        });
                    })
                        .errorCallback(function (error) {
                        self._ngZone.run(function () {
                            self.errorHandler(error);
                        });
                    });
                    this.sensortag.connectToDevice(device);
                };
                SensorClass.prototype.connectToNearestDevice = function (statusCallback) {
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
                SensorClass.prototype.initialStatusHandler = function (status) {
                    if ('DEVICE_INFO_AVAILABLE' == status) {
                        this.deviceConnectedHandler();
                    }
                    this.status = status;
                };
                SensorClass.prototype.deviceConnectedHandler = function () {
                    var self = this;
                    this.systemId = this.sensortag.getSystemId();
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
                SensorClass.prototype.statusHandler = function (status) {
                    this.status = status;
                };
                SensorClass.prototype.temperatureHandler = function (data) {
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
                SensorClass.prototype.humidityHandler = function (data) {
                    var values = this.sensortag.getHumidityValues(data);
                    // Calculate the relative humidity.
                    var h = values.relativeHumidity;
                    this.data.humidityData.relativeHumidity = h.toFixed(1);
                    var lastTenValues = this.data.humidityData.lastTenValues.slice();
                    lastTenValues.push(h);
                    lastTenValues.shift();
                    this.data.humidityData.lastTenValues = lastTenValues;
                };
                SensorClass.prototype.keypressHandler = function (data) {
                    this.data.keypressData = data[0];
                };
                SensorClass.prototype.errorHandler = function (error) {
                    if (this._evothings.easyble.error.DISCONNECTED == error) {
                    }
                    this.status = 'ERROR';
                };
                SensorClass = __decorate([
                    __param(1, core_1.Inject('Evothings')), 
                    __metadata('design:paramtypes', [core_1.NgZone, Object])
                ], SensorClass);
                return SensorClass;
            }());
            exports_1("SensorClass", SensorClass);
        }
    }
});
//# sourceMappingURL=sensor.class.js.map