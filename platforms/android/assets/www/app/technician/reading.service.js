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
    var ReadingService;
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
            ReadingService = (function () {
                function ReadingService(_http) {
                    this._http = _http;
                    this.readings = [];
                }
                ReadingService.prototype.fetch = function () {
                    var _this = this;
                    return this._http.get('http://tisensortag-node.mybluemix.net/readings')
                        .map(function (res) { return res.json(); })
                        .subscribe(function (res) {
                        _this.readings = res;
                    });
                };
                ReadingService.prototype.getReadings = function () {
                    return this.readings;
                };
                ReadingService.prototype.addReading = function (reading) {
                    this.readings.push(reading);
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    this._http.post('http://tisensortag-node.mybluemix.net/readings/add', JSON.stringify(reading), {
                        headers: headers
                    }).subscribe(function (res) { return console.log(res); });
                };
                ReadingService.prototype.getReadingsForPolicy = function (policyNumber) {
                    var readingsForPolicy = [];
                    for (var _i = 0, _a = this.readings; _i < _a.length; _i++) {
                        var reading = _a[_i];
                        if (reading.policyNumber === policyNumber) {
                            readingsForPolicy.push(reading);
                        }
                    }
                    return readingsForPolicy;
                };
                ReadingService.prototype.takeReading = function (sensors, policyNumber, isClient) {
                    if (sensors.length > 0) {
                        var reading = {
                            policyNumber: policyNumber,
                            date: new Date().getTime(),
                            sensorData: [],
                            isClient: isClient === true
                        };
                        for (var _i = 0, sensors_1 = sensors; _i < sensors_1.length; _i++) {
                            var sensor = sensors_1[_i];
                            reading.sensorData.push({
                                name: sensor.name,
                                systemId: sensor.systemId,
                                data: {
                                    humidityData: {
                                        relativeHumidity: sensor.data.humidityData.relativeHumidity
                                    },
                                    temperatureData: {
                                        targetTemperature: sensor.data.temperatureData.targetTemperature,
                                        ambientTemperature: sensor.data.temperatureData.ambientTemperature
                                    }
                                }
                            });
                        }
                        this.addReading(reading);
                        return this.getReadingsForPolicy(policyNumber);
                    }
                };
                ReadingService.prototype.reset = function () {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this._http.post('http://tisensortag-node.mybluemix.net/readings/reset', null, {
                        headers: headers
                    }).subscribe(function (res) { return console.log(res); });
                };
                ReadingService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ReadingService);
                return ReadingService;
            }());
            exports_1("ReadingService", ReadingService);
        }
    }
});
//# sourceMappingURL=reading.service.js.map