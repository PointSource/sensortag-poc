import {Component, OnInit, Inject, NgZone} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {LandingComponent} from './landing.component';
import {NavService} from './nav.service';

// Technician
import {JobListComponent} from './technician/job-list.component';
import {JobDetailsComponent} from './technician/job-details.component';
import {ConfigureJobComponent} from './technician/configure-job.component';
import {ReadingHistoryComponent} from './technician/reading-history.component'
import {SensorDetailComponent} from './sensor-detail.component';

// Client
import {AccountDetailsComponent} from './client/account-details.component';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
	{ path: '/landing', name: 'Landing', component: LandingComponent, useAsDefault: true },

    // Technician
    { path: '/jobDetails', name: 'JobDetails', component: JobDetailsComponent },
    { path: '/jobList', name: 'JobList', component: JobListComponent },
    { path: '/configureJob', name: 'ConfigureJob', component: ConfigureJobComponent },
    { path: '/readingHistory', name: 'ReadingHistory', component: ReadingHistoryComponent },
	{ path: '/sensor', name: 'SensorDetail', component: SensorDetailComponent },
    
    // Client
    { path: '/accountDetails', name: 'AccountDetails', component: AccountDetailsComponent }

])
export class AppComponent implements OnInit {

	private title = "Sensor Demo";

    constructor(
        private _navService: NavService
    ) {}

    ngOnInit() {
        this._navService.titleChanged$.subscribe(title => this.title = title);
        this._navService.backChanged$.subscribe(back => this.goBack = back);
    }

    goBack() {
        window.history.back();
    }
}

