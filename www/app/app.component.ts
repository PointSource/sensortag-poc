import {Component, OnInit, Inject, NgZone} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {SensorDetailComponent} from './sensor-detail.component';
import {SensorListComponent} from './sensor-list.component';
import {ClientComponent} from './client.component';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig(
	[
		{ path: '/sensorList', name: 'SensorList', component: SensorListComponent, useAsDefault: true },
		{ path: '/client', name: 'Client', component: ClientComponent },
    	{ path: '/sensor', name: 'SensorDetail', component: SensorDetailComponent }
	]
)
export class AppComponent {



}

