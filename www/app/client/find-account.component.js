System.register(['angular2/core', 'angular2/router', '../technician/job.service', '../nav.service', '../sensor.component'], function(exports_1, context_1) {
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
    var core_1, router_1, job_service_1, nav_service_1, sensor_component_1;
    var FindAccountComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
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
            FindAccountComponent = (function () {
                function FindAccountComponent(_jobService, _navService, _router) {
                    this._jobService = _jobService;
                    this._navService = _navService;
                    this._router = _router;
                }
                FindAccountComponent.prototype.ngOnInit = function () {
                    this._navService.setTitle("Get Account");
                };
                FindAccountComponent.prototype.findAccount = function (policyNumber) {
                    var job = this._jobService.getJob(policyNumber);
                    if (job === undefined) {
                        this.status = "ERROR";
                    }
                    else {
                        this._router.navigate(['Client', { policyNumber: policyNumber }]);
                    }
                };
                FindAccountComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/client/find-account.component.html',
                        directives: [sensor_component_1.SensorComponent]
                    }), 
                    __metadata('design:paramtypes', [job_service_1.JobService, nav_service_1.NavService, router_1.Router])
                ], FindAccountComponent);
                return FindAccountComponent;
            }());
            exports_1("FindAccountComponent", FindAccountComponent);
        }
    }
});
//# sourceMappingURL=find-account.component.js.map