// Have to do this in order to mock Router
import { SpyLocation } from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {Router, RouterOutlet, RouterLink, RouteParams, RouteData, Location, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {RouteRegistry} from 'angular2/src/router/route_registry';
import {DirectiveResolver} from 'angular2/src/core/linker/directive_resolver';
// End of Router imports

import {
	beforeEach,
	beforeEachProviders,
	describe,
	expect,
	it,
	inject,
	injectAsync } from 'angular2/testing';
import {provide, NgZone} from "angular2/core"
import {Http} from 'angular2/http';

import {JobService} from "./job.service"
import {SensorService} from "../sensor.service"
import {ReadingService} from "../technician/reading.service"
import {SensorFactory} from "../sensor.factory"
import {BLEService} from "../ble.service"
import {NavService} from "../nav.service"

import {JobDetailsComponent} from "./job-details.component"
import {EVO_THINGS} from '../app.token';

beforeEachProviders(() => {

	// Set up mock data
	class MockJobService extends JobService {
		getJob() {
			return {
				policyNumber: "01929",
				name: "Andrew Mortensen",
				numSensors: 0
			}
		}
	}

	var _evothings = {
		ble: jasmine.createSpyObj("ble", ['connect']),
		easyble: jasmine.createSpyObj("easyble", [
			'startScan', 'stopScan', 'closeConnectedDevices'
		]),
		tisensortag: {
			createInstance: function() {
				return {}
			}
		}
	}

	return [
	// Have to do this in order to mock Router
		RouteRegistry,
		provide(Location, { useClass: SpyLocation }),
		provide(ROUTER_PRIMARY_COMPONENT, { useValue: JobDetailsComponent }),
		provide(Router, { useClass: RootRouter }),
	// End of Router config

		provide(JobService, { useClass: MockJobService }),
		BLEService,
		SensorService,
		ReadingService,
		NavService,
		SensorFactory,
		JobDetailsComponent,
		provide(RouteParams, { useValue: new RouteParams({ policyNumber: '01929' }) }),
		provide(EVO_THINGS, {
			useValue: _evothings
		}),
		provide(NgZone, { useValue: {} }),
		provide(Http, {
			useValue: {
				get: () => {
					return {
						map: () => {
							return {
								subscribe: () => {
									return {
										add: (callback) => { callback() }
									}
								}

							}
						},
					}
				}
			}
		}),
	]
});

describe('Job Details Component', () => {

	let _jobDetails;

	beforeEach(inject(
		[JobDetailsComponent],
		(jobDetails: JobDetailsComponent) => {
			_jobDetails = jobDetails;
		}
	))

	describe('on init', () => {

		it('gets the sensors for this policy', () => {
			_jobDetails._sensorService.addSensor({
				policyNumber: "01929",
				status: "DISCONNECTED",
				data: {
					humidityData: {
						lastTenValues: [0, 0, 0],
						relativeHumidity: 50
					}
				}
			});
			spyOn(_jobDetails._sensorService, "getSensorsForPolicy").and.callThrough();
			_jobDetails.ngOnInit();
			expect(_jobDetails._sensorService.getSensorsForPolicy).toHaveBeenCalled();
		})

		it('if devices were connected, simply sets sensor list', () => {
			_jobDetails._sensorService.addSensor({
				policyNumber: "01929",
				status: "DISCONNECTED",
				data: {
					humidityData: {
						lastTenValues: [0, 0, 0],
						relativeHumidity: 50
					}
				},
				name: "Garage"
			});
			spyOn(_jobDetails._sensorFactory, "sensor").and.callThrough();
			_jobDetails.ngOnInit();
			expect(_jobDetails._sensorFactory.sensor).not.toHaveBeenCalled();
			expect(_jobDetails.sensors.length).toBe(1);
		});

		it('if devices were not connected, initializes them', () => {
			_jobDetails._sensorService.addSensor({
				policyNumber: "01929",
				status: "DISCONNECTED",
				name: "Garage"
			});
			spyOn(_jobDetails._sensorFactory, "sensor").and.callThrough();
			_jobDetails.ngOnInit();
			expect(_jobDetails._sensorFactory.sensor).toHaveBeenCalled();
			expect(_jobDetails.sensors.length).toBe(1);
		});
	});

	describe('once sensors are loaded', () => {

		it('if the sensors were disconnected, scans for the sensors', () => {
			_jobDetails._sensorService.addSensor({
				policyNumber: "01929",
				status: "DISCONNECTED",
				name: "Garage"
			});
			spyOn(_jobDetails, "scanForSensors").and.callThrough();
			_jobDetails.ngOnInit();
			expect(_jobDetails.scanForSensors).toHaveBeenCalled();
		});

	});

	describe('when scanning for sensors', () => {

		it('if the sensors were disconnected, scans for the sensors', () => {
			_jobDetails._sensorService.addSensor({
				policyNumber: "01929",
				status: "DISCONNECTED",
				name: "Garage"
			});
			_jobDetails.ngOnInit();
			spyOn(_jobDetails.sensors[0], "scanForSensor").and.callThrough();
			_jobDetails.scanForSensors();

			expect(_jobDetails.sensors[0].scanForSensor).toHaveBeenCalled();
		});

	});


});