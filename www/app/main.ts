import {provide} from 'angular2/core';
import {bootstrap}    from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {AppComponent} from './app.component';

declare var evothings: any;
declare var IoTFoundationLib: any;

bootstrap(AppComponent, [
	ROUTER_PROVIDERS,
	provide('Evothings', { useValue: evothings }),
	provide('IoTFoundationLib', { useValue: IoTFoundationLib }),
	provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
