System.register(['angular2/core', 'angular2/router', './landing.component', './nav.service', './technician/job-list.component', './technician/job-details.component', './technician/configure-job.component', './technician/reading-history.component', './sensor-detail.component', './client/account-details.component'], function(exports_1, context_1) {
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
    var core_1, router_1, landing_component_1, nav_service_1, job_list_component_1, job_details_component_1, configure_job_component_1, reading_history_component_1, sensor_detail_component_1, account_details_component_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (landing_component_1_1) {
                landing_component_1 = landing_component_1_1;
            },
            function (nav_service_1_1) {
                nav_service_1 = nav_service_1_1;
            },
            function (job_list_component_1_1) {
                job_list_component_1 = job_list_component_1_1;
            },
            function (job_details_component_1_1) {
                job_details_component_1 = job_details_component_1_1;
            },
            function (configure_job_component_1_1) {
                configure_job_component_1 = configure_job_component_1_1;
            },
            function (reading_history_component_1_1) {
                reading_history_component_1 = reading_history_component_1_1;
            },
            function (sensor_detail_component_1_1) {
                sensor_detail_component_1 = sensor_detail_component_1_1;
            },
            function (account_details_component_1_1) {
                account_details_component_1 = account_details_component_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(_navService) {
                    this._navService = _navService;
                    this.title = "Sensor Demo";
                }
                AppComponent.prototype.ngOnInit = function () {
                    var _this = this;
                    this._navService.titleChanged$.subscribe(function (title) { return _this.title = title; });
                    this._navService.backChanged$.subscribe(function (back) { return _this.goBack = back; });
                };
                AppComponent.prototype.goBack = function () {
                    window.history.back();
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'my-app',
                        templateUrl: 'app/app.component.html',
                        styleUrls: ['app/app.component.css'],
                        directives: [router_1.ROUTER_DIRECTIVES]
                    }),
                    router_1.RouteConfig([
                        { path: '/landing', name: 'Landing', component: landing_component_1.LandingComponent, useAsDefault: true },
                        // Technician
                        { path: '/jobDetails', name: 'JobDetails', component: job_details_component_1.JobDetailsComponent },
                        { path: '/jobList', name: 'JobList', component: job_list_component_1.JobListComponent },
                        { path: '/configureJob', name: 'ConfigureJob', component: configure_job_component_1.ConfigureJobComponent },
                        { path: '/readingHistory', name: 'ReadingHistory', component: reading_history_component_1.ReadingHistoryComponent },
                        { path: '/sensor', name: 'SensorDetail', component: sensor_detail_component_1.SensorDetailComponent },
                        // Client
                        { path: '/accountDetails', name: 'AccountDetails', component: account_details_component_1.AccountDetailsComponent }
                    ]), 
                    __metadata('design:paramtypes', [nav_service_1.NavService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map