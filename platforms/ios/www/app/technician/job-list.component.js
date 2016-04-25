System.register(['angular2/core', '../nav.service', './job.service', '../sensor.service', 'angular2/router'], function(exports_1, context_1) {
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
    var core_1, nav_service_1, job_service_1, sensor_service_1, router_1;
    var JobListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (nav_service_1_1) {
                nav_service_1 = nav_service_1_1;
            },
            function (job_service_1_1) {
                job_service_1 = job_service_1_1;
            },
            function (sensor_service_1_1) {
                sensor_service_1 = sensor_service_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            JobListComponent = (function () {
                function JobListComponent(_router, _navService, _jobService, _sensorService, myElement, _foundation, _jquery) {
                    this._router = _router;
                    this._navService = _navService;
                    this._jobService = _jobService;
                    this._sensorService = _sensorService;
                    this.myElement = myElement;
                    this._foundation = _foundation;
                    this._jquery = _jquery;
                }
                JobListComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._navService.setTitle("My Jobs");
                    this._navService.setBack(function () {
                        _this._router.navigate(['Landing', {}]);
                    });
                    this.newJob = {
                        name: "",
                        policyNumber: "",
                        numSensors: 0
                    };
                    this.jobList = this._jobService.getJobs();
                    this.modalElement = this._jquery(this.myElement.nativeElement.children[0]);
                    var elem = new this._foundation.Reveal(this.modalElement);
                };
                JobListComponent.prototype.addJob = function () {
                    this.modalElement.foundation('open');
                };
                JobListComponent.prototype.addJobToList = function () {
                    var policyNumber = this.newJob.policyNumber;
                    this._jobService.addJob({
                        name: this.newJob.name,
                        policyNumber: this.newJob.policyNumber,
                        numSensors: 0
                    });
                    this.jobList = this._jobService.getJobs();
                    this.newJob = {
                        name: "",
                        policyNumber: "",
                        numSensors: 0
                    };
                    this.modalElement.foundation('close');
                    this._router.navigate(['ConfigureJob', { policyNumber: policyNumber }]);
                };
                JobListComponent.prototype.goToJob = function (job) {
                    if (job.numSensors > 0) {
                        this._router.navigate(['JobDetails', { policyNumber: job.policyNumber }]);
                    }
                    else {
                        this._router.navigate(['ConfigureJob', { policyNumber: job.policyNumber }]);
                    }
                };
                JobListComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/technician/job-list.component.html'
                    }),
                    __param(5, core_1.Inject('Foundation')),
                    __param(6, core_1.Inject('jQuery')), 
                    __metadata('design:paramtypes', [router_1.Router, nav_service_1.NavService, job_service_1.JobService, sensor_service_1.SensorService, core_1.ElementRef, Object, Object])
                ], JobListComponent);
                return JobListComponent;
            }());
            exports_1("JobListComponent", JobListComponent);
        }
    }
});
//# sourceMappingURL=job-list.component.js.map