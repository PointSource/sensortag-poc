import {provide} from 'angular2/core';
import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app.component';

declare var evothings: any;
declare var IoTFoundationLib: any;

bootstrap(AppComponent, [
	provide('Evothings', { useValue: evothings }),
	provide('IoTFoundationLib', { useValue: IoTFoundationLib })
]);
