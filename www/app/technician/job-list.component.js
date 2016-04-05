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
    var JobListComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            JobListComponent = (function () {
                function JobListComponent(_router) {
                    this._router = _router;
                }
                JobListComponent.prototype.ngOnInit = function () {
                    this.jobList = [{
                            name: "Williams, Randy",
                            policyNumber: "95916"
                        }, {
                            name: "Gartland, JP",
                            policyNumber: "00012"
                        }, {
                            name: "Peterson, Jared",
                            policyNumber: "01929"
                        }];
                };
                JobListComponent.prototype.goToTechnician = function () {
                    this._router.navigate(['JobList', {}]);
                };
                JobListComponent = __decorate([
                    core_1.Component({
                        templateUrl: 'app/technician/job-list.component.html',
                    }), 
                    __metadata('design:paramtypes', [router_1.Router])
                ], JobListComponent);
                return JobListComponent;
            }());
            exports_1("JobListComponent", JobListComponent);
        }
    }
});
//# sourceMappingURL=job-list.component.js.map