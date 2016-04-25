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
    var BLEService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            BLEService = (function () {
                function BLEService(_evothings) {
                    this._evothings = _evothings;
                    this.DEVICEINFO_SERVICE = '0000180a-0000-1000-8000-00805f9b34fb';
                    this.SYSTEM_ID = '00002a23-0000-1000-8000-00805f9b34fb';
                    // Create SensorTag CC2650 instance.
                    this.sensortag = this._evothings.tisensortag.createInstance(this._evothings.tisensortag.CC2650_BLUETOOTH_SMART);
                }
                BLEService.prototype.disconnectAllDevices = function () {
                    this._evothings.easyble.closeConnectedDevices();
                };
                BLEService.prototype.deviceIsSensorTag = function (device) {
                    return this.sensortag.deviceIsSensorTag(device);
                };
                BLEService.prototype.getSystemIdFromDevice = function (device, success, fail) {
                    var _this = this;
                    if (this.sensortag.deviceIsSensorTag(device)) {
                        device.connect(function (device) {
                            _this.readSystemId(device, success, fail);
                        }, fail);
                    }
                };
                BLEService.prototype.readSystemId = function (device, success, fail) {
                    var _this = this;
                    var self = this;
                    console.log(device.address, 'connect success');
                    device.readServices([this.DEVICEINFO_SERVICE], function (device) {
                        console.log(device.address, 'read services success');
                        device.readServiceCharacteristic(_this.DEVICEINFO_SERVICE, _this.SYSTEM_ID, function (data) {
                            console.log(device.address, 'got system id');
                            var systemId = _this._evothings.util.typedArrayToHexString(data);
                            success(systemId, device);
                        }, function (error) {
                            console.log(device.address, 'read characteristics FAIL');
                            console.log(error);
                        });
                    }, function (error) {
                        console.log(device.address, 'read services FAIL');
                        fail(error);
                    });
                };
                BLEService = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Inject('Evothings')), 
                    __metadata('design:paramtypes', [Object])
                ], BLEService);
                return BLEService;
            }());
            exports_1("BLEService", BLEService);
        }
    }
});
//# sourceMappingURL=ble.service.js.map