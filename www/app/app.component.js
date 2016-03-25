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
    var core_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(_ngZone) {
                    this._ngZone = _ngZone;
                    this.initialiseSensorTag();
                    this.title = "Sensor Tag fun";
                    this.status = "";
                }
                AppComponent.prototype.initialiseSensorTag = function () {
                    var self = this;
                    // Create SensorTag CC2650 instance.
                    this.sensortag = evothings.tisensortag.createInstance(evothings.tisensortag.CC2650_BLUETOOTH_SMART);
                    //
                    // Here sensors are set up.
                    //
                    // If you wish to use only one or a few sensors, just set up
                    // the ones you wish to use.
                    //
                    // First parameter to sensor function is the callback function.
                    // Several of the sensors take a millisecond update interval
                    // as the second parameter.
                    //
                    this.sensortag
                        .statusCallback(function (status) {
                        self._ngZone.run(function () {
                            self.statusHandler(status);
                        });
                    })
                        .errorCallback(this.errorHandler);
                    // .keypressCallback(keypressHandler)
                    // .temperatureCallback(temperatureHandler, 1000)
                    // .humidityCallback(humidityHandler, 1000)
                    // .barometerCallback(barometerHandler, 1000)
                    // .accelerometerCallback(accelerometerHandler, 1000)
                    // .magnetometerCallback(magnetometerHandler, 1000)
                    // .gyroscopeCallback(gyroscopeHandler, 1000)
                    // .luxometerCallback(luxometerHandler, 1000)
                };
                AppComponent.prototype.connect = function () {
                    this.title = "connect";
                    this.sensortag.connectToNearestDevice();
                };
                AppComponent.prototype.disconnect = function () {
                    alert(this.status);
                };
                AppComponent.prototype.statusHandler = function (status) {
                    if ('DEVICE_INFO_AVAILABLE' == status) {
                        // Show a notification about that the firmware should be
                        // upgraded if the connected device is a SensorTag CC2541
                        // with firmware revision less than 1.5, since this the
                        // SensorTag library does not support these versions.
                        var upgradeNotice = document.getElementById('upgradeNotice');
                        if ('CC2541' == this.sensortag.getDeviceModel() &&
                            parseFloat(this.sensortag.getFirmwareString()) < 1.5) {
                            upgradeNotice.classList.remove('hidden');
                        }
                        else {
                            upgradeNotice.classList.add('hidden');
                        }
                        // Show device model and firmware version.
                        // displayValue('DeviceModel', this.sensortag.getDeviceModel())
                        // displayValue('FirmwareData', this.sensortag.getFirmwareString())
                        // Show which sensors are not supported by the connected SensorTag.
                        if (!this.sensortag.isLuxometerAvailable()) {
                            document.getElementById('Luxometer').style.display = 'none';
                        }
                    }
                    this.title = status;
                };
                AppComponent.prototype.errorHandler = function (error) {
                    console.log('Error: ' + error);
                    if (evothings.easyble.error.DISCONNECTED == error) {
                        resetSensorDisplayValues();
                    }
                    else {
                        this.title = 'Error: ' + error;
                        alert('Error: ' + error);
                    }
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        templateUrl: 'app/app.component.html'
                    }), 
                    __metadata('design:paramtypes', [core_1.NgZone])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map