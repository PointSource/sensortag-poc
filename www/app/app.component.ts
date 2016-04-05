import {Component, OnInit, Inject, NgZone} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {SensorDetailComponent} from './sensor-detail.component';
import {ClientComponent} from './client.component';
import {LandingComponent} from './landing.component';
import {JobListComponent} from './technician/job-list.component';
import {ConfigureJobComponent} from './technician/configure-job.component';
import {NavService} from './nav.service';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
	{ path: '/landing', name: 'Landing', component: LandingComponent, useAsDefault: true },
	{ path: '/jobList', name: 'JobList', component: JobListComponent },
    { path: '/configureJob', name: 'ConfigureJob', component: ConfigureJobComponent },
	{ path: '/client', name: 'Client', component: ClientComponent },
	{ path: '/sensor', name: 'SensorDetail', component: SensorDetailComponent }
])
export class AppComponent implements OnInit {

	private title = "Sensor Demo";

    constructor(
        private _navService: NavService
    ) {}

    ngOnInit() {
        this._navService.titleChanged$.subscribe(title => this.title = title);
    }

    goBack() {
        window.history.back();
    }
}

