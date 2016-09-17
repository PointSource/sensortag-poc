import {provide} from 'angular2/core';
import {bootstrap}    from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AppComponent} from './app.component';
import {CHARTJS, CORDOVA_DEVICE, EVO_THINGS, FOUNDATION, IOT_FOUNDATION_LIB, JQUERY } from './app.token';
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
	provide(EVO_THINGS, { useValue: evothings }),
	provide(IOT_FOUNDATION_LIB, { useValue: IoTFoundationLib }),
	provide(CHARTJS, { useValue: Chart }),
	provide(FOUNDATION, { useValue: Foundation }),
	provide(JQUERY, { useValue: jQuery }),
	provide(CORDOVA_DEVICE, { useValue: device }),
	provide(LocationStrategy, { useClass: HashLocationStrategy })
]);
