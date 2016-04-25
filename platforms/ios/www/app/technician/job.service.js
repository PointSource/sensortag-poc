System.register(['angular2/core', '../sensor.service'], function(exports_1, context_1) {
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
    var core_1, sensor_service_1;
    var JobService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (sensor_service_1_1) {
                sensor_service_1 = sensor_service_1_1;
            }],
        execute: function() {
            JobService = (function () {
                function JobService(_sensorService) {
                    this._sensorService = _sensorService;
                    this.jobs = [];
                    this.jobs = [{
                            name: "Williams, Randy",
                            policyNumber: "95916",
                            numSensors: 0
                        }, {
                            name: "Gartland, JP",
                            policyNumber: "00012",
                            numSensors: 0
                        }, {
                            name: "Peterson, Jared",
                            policyNumber: "01929",
                            numSensors: 0
                        }];
                }
                JobService.prototype.getJobs = function () {
                    for (var _i = 0, _a = this.jobs; _i < _a.length; _i++) {
                        var job = _a[_i];
                        job.numSensors = this._sensorService.countSensorsForPolicy(job.policyNumber);
                    }
                    return this.jobs;
                };
                JobService.prototype.addJob = function (job) {
                    this.jobs.push(job);
                };
                JobService.prototype.getJob = function (policyNumber) {
                    return this.jobs.find(function (job) { return job.policyNumber === policyNumber; });
                };
                JobService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [sensor_service_1.SensorService])
                ], JobService);
                return JobService;
            }());
            exports_1("JobService", JobService);
        }
    }
});
//# sourceMappingURL=job.service.js.map