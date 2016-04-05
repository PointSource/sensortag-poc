import {provide} from 'angular2/core';
import {bootstrap}    from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AppComponent} from './app.component';
import {SensorService} from './sensor.service';
import {NavService} from './nav.service';

declare var evothings: any;
declare var IoTFoundationLib: any;
declare var Chart: any;

bootstrap(AppComponent, [
	ROUTER_PROVIDERS,
	HTTP_PROVIDERS,
	SensorService,
	NavService,
	provide('Evothings', { useValue: evothings }),
	provide('IoTFoundationLib', { useValue: IoTFoundationLib }),
	provide('ChartJS', { useValue: Chart }),
	provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
