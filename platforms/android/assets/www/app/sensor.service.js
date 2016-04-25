System.register(['angular2/core', 'angular2/http', 'rxjs/Rx'], function(exports_1, context_1) {
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
    var core_1, http_1;
    var SensorService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {}],
        execute: function() {
            SensorService = (function () {
                function SensorService(_http) {
                    this._http = _http;
                    this.sensors = [];
                    this.clientSensors = [];
                }
                SensorService.prototype.fetch = function () {
                    var _this = this;
                    return this._http.get('http://tisensortag-node.mybluemix.net/devices')
                        .map(function (res) { return res.json(); })
                        .subscribe(function (res) {
                        _this.sensors = res;
                    });
                };
                SensorService.prototype.sync = function () {
                    var sensorsCopy = [];
                    for (var _i = 0, _a = this.sensors; _i < _a.length; _i++) {
                        var sensor = _a[_i];
                        sensorsCopy.push({
                            status: "DISCONNECTED",
                            systemId: sensor.systemId,
                            name: sensor.name,
                            policyNumber: sensor.policyNumber
                        });
                    }
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    this._http.post('http://tisensortag-node.mybluemix.net/devices/sync', JSON.stringify(sensorsCopy), {
                        headers: headers
                    }).subscribe(function (res) { return console.log(res); });
                };
                SensorService.prototype.getSensors = function () {
                    return this.sensors;
                };
                SensorService.prototype.getSensorsForPolicy = function (policyNumber) {
                    var sensorsForPolicy = [];
                    for (var _i = 0, _a = this.sensors; _i < _a.length; _i++) {
                        var sensor = _a[_i];
                        if (sensor.policyNumber === policyNumber) {
                            sensorsForPolicy.push(sensor);
                        }
                    }
                    return sensorsForPolicy;
                };
                SensorService.prototype.countSensorsForPolicy = function (policyNumber) {
                    var count = 0;
                    for (var _i = 0, _a = this.sensors; _i < _a.length; _i++) {
                        var sensor = _a[_i];
                        if (sensor.policyNumber === policyNumber) {
                            count++;
                        }
                    }
                    return count;
                };
                SensorService.prototype.addSensor = function (sensor) {
                    this.sensors.push(sensor);
                };
                SensorService.prototype.getSensor = function (systemId) {
                    return this.sensors.find(function (sensor) { return sensor.systemId === systemId; });
                };
                SensorService.prototype.removeSensor = function (systemId) {
                    var index = this.sensors.findIndex(function (sensor) { return sensor.systemId === systemId; });
                    this.sensors.splice(index, 1);
                };
                SensorService.prototype.replaceSensor = function (newSensor) {
                    var index = this.sensors.findIndex(function (sensor) { return sensor.systemId === newSensor.systemId; });
                    if (index != -1) {
                        this.sensors[index] = newSensor;
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                SensorService.prototype.setClientSensors = function (clientSensors) {
                    this.clientSensors = clientSensors;
                };
                SensorService.prototype.getClientSensors = function () {
                    return this.clientSensors;
                };
                SensorService.prototype.reset = function () {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this._http.post('http://tisensortag-node.mybluemix.net/devices/reset', null, {
                        headers: headers
                    }).subscribe(function (res) { return console.log(res); });
                };
                SensorService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], SensorService);
                return SensorService;
            }());
            exports_1("SensorService", SensorService);
        }
    }
});
//# sourceMappingURL=sensor.service.js.map