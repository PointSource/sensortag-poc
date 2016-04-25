System.register(['angular2/core', 'angular2/router'], function(exports_1, context_1) {
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
    var core_1, router_1;
    var SensorComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            SensorComponent = (function () {
                function SensorComponent(_router) {
                    this._router = _router;
                    this.isNamed = true;
                    this.isConnected = true;
                    this.onDeviceDisconnected = new core_1.EventEmitter();
                }
                SensorComponent.prototype.nameDevice = function (name) {
                    this.isNamed = true;
                    this.sensor.name = name;
                };
                SensorComponent.prototype.disconnect = function () {
                    this.sensor.sensortag.disconnectDevice();
                    this.sensor.status = "DISCONNECTED";
                    this.isConnected = false;
                    this.onDeviceDisconnected.emit("event");
                };
                SensorComponent.prototype.scanForSensor = function () {
                    this.sensor.scanForSensor();
                };
                SensorComponent.prototype.goToSensorDetails = function () {
                    this._router.navigate(['SensorDetail', { systemId: this.sensor.systemId }]);
                };
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', Object)
                ], SensorComponent.prototype, "onDeviceDisconnected", void 0);
                SensorComponent = __decorate([
                    core_1.Component({
                        selector: 'sensor',
                        templateUrl: 'app/sensor.component.html',
                        styleUrls: ['app/sensor.component.css'],
                        inputs: ['sensor', 'mode']
                    }), 
                    __metadata('design:paramtypes', [router_1.Router])
                ], SensorComponent);
                return SensorComponent;
            }());
            exports_1("SensorComponent", SensorComponent);
        }
    }
});
//# sourceMappingURL=sensor.component.js.map