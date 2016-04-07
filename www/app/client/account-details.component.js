System.register(['angular2/core', 'angular2/router', '../sensor.service', '../technician/job.service', '../nav.service', '../sensor.component'], function(exports_1, context_1) {
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
    var core_1, router_1, sensor_service_1, job_service_1, nav_service_1, sensor_component_1;
    var AccountDetailsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (sensor_service_1_1) {
                sensor_service_1 = sensor_service_1_1;
            },
            function (job_service_1_1) {
                job_service_1 = job_service_1_1;
            },
            function (nav_service_1_1) {
                nav_service_1 = nav_service_1_1;
            },
            function (sensor_component_1_1) {
                sensor_component_1 = sensor_component_1_1;
            }],
        execute: function() {
            AccountDetailsComponent = (function () {
                function AccountDetailsComponent(_sensorService, _jobService, _navService, _routeParams, _evothings, _ngZone) {
                    this._sensorService = _sensorService;
                    this._jobService = _jobService;
                    this._navService = _navService;
                    this._routeParams = _routeParams;
                    this._evothings = _evothings;
                    this._ngZone = _ngZone;
                }
                AccountDetailsComponent.prototype.ngOnInit = function () {
                    var policyNumber = this._routeParams.get('policyNumber');
                    this.job = this._jobService.getJob(policyNumber);
                    this._navService.setTitle("My Sensors");
                };
                AccountDetailsComponent.prototype.loadSensors = function () {
                    // this._sensorService.fetch().add(() => {
                    this.sensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);
                    this.scanForSensors();
                    // });
                };
                AccountDetailsComponent.prototype.scanForSensors = function () {
                };
                AccountDetailsComponent.prototype.statusHandler = function (index, status) {
                    this.sensors[index].status = status;
                    if (status === "DEVICE_INFO_AVAILABLE") {
                        this.sensors[index].isConnected = true;
                    }
                };
                AccountDetailsComponent.prototype.takeReading = function () {
                    alert("Reading successfully submitted");
                };
                AccountDetailsComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/client/account-details.component.html',
                        directives: [sensor_component_1.SensorComponent]
                    }),
                    __param(4, core_1.Inject('Evothings')), 
                    __metadata('design:paramtypes', [sensor_service_1.SensorService, job_service_1.JobService, nav_service_1.NavService, router_1.RouteParams, Object, core_1.NgZone])
                ], AccountDetailsComponent);
                return AccountDetailsComponent;
            }());
            exports_1("AccountDetailsComponent", AccountDetailsComponent);
        }
    }
});
//# sourceMappingURL=account-details.component.js.map