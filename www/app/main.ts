import {provide} from 'angular2/core';
import {bootstrap}    from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AppComponent} from './app.component';
import {SensorService} from './sensor.service';
import {SensorFactory} from './sensor.factory';
import {BLEService} from './ble.service';
import {NavService} from './nav.service';
import {JobService} from './technician/job.service';
import {ReadingService} from './technician/reading.service';

declare var evothings: any;
declare var IoTFoundationLib: any;
declare var Chart: any;
declare var Foundation: any;
declare var jQuery: any;
declare var device: any;

bootstrap(AppComponent, [
	ROUTER_PROVIDERS,
	HTTP_PROVIDERS,
	SensorService,
	SensorFactory,
	NavService,
	JobService,
	ReadingService,
	BLEService,
	provide('Evothings', { useValue: evothings }),
	provide('IoTFoundationLib', { useValue: IoTFoundationLib }),
	provide('ChartJS', { useValue: Chart }),
	provide('Foundation', { useValue: Foundation }),
	provide('jQuery', { useValue: jQuery }),
	provide('CordovaDevice', { useValue: device }),
	provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
