						// [{
						// 	systemId: "1234",
						// 	policyNumber: "Job1",
						// 	name: "Garage",
						// 	status: "CONNECTED",
						// 	sensortag: {},
						// 	data: {},
						// }, {
						// 	systemId: "5678",
						// 	policyNumber: "Job2",
						// 	name: "Garage2",
						// 	status: "CONNECTED",
						// 	sensortag: {},
						// 	data: {},
						// }]

import {Http} from 'angular2/http';

class MockJobService extends JobService {
	getJob() {
		return {
			policyNumber: "Job1",
			name: "Andrew Mortensen",
			numSensors: 0
		}
	}
}

import {
	beforeEach,
	beforeEachProviders,
	describe,
	expect,
	it,
	inject,
	injectAsync } from 'angular2/testing';
import {provide} from "angular2/core"

import {RouteParams} from 'angular2/router';


import {NgZone} from 'angular2/core';
import {SensorService} from "../sensor.service"
import {SensorFactory} from "../sensor.factory"
import {JobService} from "../technician/job.service"
import {ReadingService} from "../technician/reading.service"

import {AccountDetailsComponent} from "./account-details.component"


beforeEachProviders(() => {
	return [
		provide(NgZone, { useValue: {} }),
		provide(RouteParams, { useValue: new RouteParams({ id: '1' }) }),
		provide(Http, {useValue: {get: ()=> {
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
		}}}),
		SensorFactory,
		ReadingService,
		provide(JobService, { useClass: MockJobService }),
		SensorService,
		AccountDetailsComponent,
		provide('Evothings', {
			useValue: {
				tisensortag: {
					createInstance: function() {
						return {}
					}
				},
				easyble: {
					startScan: () => { },
					stopScan: () => { }
				}
			}
		}),
	];
});


describe('Account Details', () => {
	// let _sensorService: SensorService;
	// let _jobService: JobService;
	// let _navService = jasmine.createSpyObj("_navService", ['setTitle']);
	// let _bleService = jasmine.createSpyObj("_bleService", ['deviceConnectSuccess']);
	// let _http: Http;
	// let _routeParams = jasmine.createSpyObj("_routeParams", ['get']);
	// let accountDetails;
	// let _ngZone: NgZone;
	// let _injector;
	// let _sensorFactory;

	// let _evothings;
	// let sensortag;
	// let sensor;
	// let device;

	// beforeEach( () => {
	// 	_sensorService = new SensorService(_http);
	// 	_jobService = new JobService(_sensorService);

	// 	device = jasmine.createSpyObj('device', [
	// 		'readServiceCharacteristic',
	// 		'readServices',
	// 		'close'
	// 	])


	// 	sensortag = {
	// 		startScanningForDevices: () => {},
	// 		statusCallback: () => sensortag,
	// 		errorCallback: () => sensortag,
	// 		keypressCallback: () => sensortag,
	// 		temperatureCallback: () => sensortag,
	// 		humidityCallback: () => sensortag,
	// 		connectToNearestDevice: () => { },
	// 		connectToDevice: () => { },
	// 		celsiusToFahrenheit: (celsius) => {
	// 			return (celsius * 9 / 5) + 32
	// 		},
	// 		deviceIsSensorTag: () => {}
	// 	};

	// 	_evothings = {
	// 		ble: jasmine.createSpyObj("ble", ['connect']),
	// 		easyble: jasmine.createSpyObj("easyble", ['startScan', 'stopScan']),
	// 		tisensortag: {
	// 			createInstance: function() {
	// 				return sensortag
	// 			}
	// 		}
	// 	}

	// 	sensor = {
	// 		initialize: () => { },
	// 		sensortag: sensortag,
	// 		connectToDevice: () => { },
	// 		setName: () => {}
	// 	};



	// 	_sensorFactory = jasmine.createSpyObj("_sensorFactory", ["sensor"]);
	// 	_sensorFactory.sensor.and.returnValue(sensor);

	// 	spyOn(_jobService, "getJob").and.returnValue({
	// 		policyNumber: "Job1",
	// 		name: "Andrew Mortensen",
	// 		numSensors: 0
	// 	})


	// 	spyOn(_sensorService, "getSensorsForPolicy").and.returnValue([{
	// 		policyNumber: "Job1",
	// 		systemId: "MATCHES",
	// 		sensortag: sensortag
	// 	}]);


	// 	spyOn(_sensorService, "fetch").and.returnValue({
	// 		add: (callback) => {
	// 			callback();
	// 		}
	// 	});

	// 	accountDetails = new AccountDetailsComponent(
	// 		_sensorService,
	// 		_jobService,
	// 		_bleService,
	// 		_navService,
	// 		_routeParams,
	// 		_evothings,
	// 		_ngZone,
	// 		_injector,
	// 		_sensorFactory
	// 	);
	// })

	fdescribe('on load sensors', () => {

		let accountDetails;
		let sensorService;

		beforeEach(inject(
			[AccountDetailsComponent, SensorService],
			(_accountDetails: AccountDetailsComponent, _sensorService: SensorService) => {
				sensorService = _sensorService;
				accountDetails = _accountDetails;
				spyOn(_accountDetails, "scanForSensors");
				spyOn(_sensorService, "getSensorsForPolicy");
				_accountDetails.ngOnInit();
				_accountDetails.loadSensors();
			}
		))

		it('calls sensorService.getSensorsForPolicy with this policy number', () => {
			expect(sensorService.getSensorsForPolicy).toHaveBeenCalledWith(accountDetails.job.policyNumber);
		});

		it('calls scanForSensors', () => {
			expect(accountDetails.scanForSensors).toHaveBeenCalled();
		});

	})


	xdescribe('on scan for sensors', () => {

		beforeEach(() => {
			accountDetails.ngOnInit();
			accountDetails.scanForSensors();
		})

		it('calls easyble.scan', () => {
			expect(_evothings.easyble.startScan).toHaveBeenCalled();
		});


		it('sets status to scanning', () => {
			expect(accountDetails.status).toEqual("SCANNING");
		});

	});


	xdescribe('on stop scan', () => {

		it('calls easyble.stopScan', () => {
			accountDetails.ngOnInit();
			accountDetails.stopScanning();
			expect(_evothings.easyble.stopScan).toHaveBeenCalled();
		});

	});



	xdescribe('when device is connected', () => {

		beforeEach(() => {
			accountDetails.ngOnInit();
			accountDetails.loadSensors();
		})

		describe("if the system id matches,", () => {

			it('adds the device to the list of matches', () => {
				accountDetails.gotSystemId("MATCHES", device);
				expect(accountDetails.sensors.length).toBeGreaterThan(0);
			});

			it('connects to the device using the sensor that matches', () => {
				spyOn(sensor, "connectToDevice");
				accountDetails.gotSystemId("MATCHES", device);
				expect(sensor.connectToDevice).toHaveBeenCalled();
			});
		})


		describe('if system id does not match', () => {

			beforeEach(() => {
				accountDetails.gotSystemId("NOT A MATCH", device);
			});

			it('does not add it to the list', () => {
				expect(accountDetails.sensors.length).toEqual(0);
			});

			it('disconnects from device', () => {
				expect(device.close).toHaveBeenCalled();
			});
		})



	});

	xdescribe('on scan fail', () => {

		it('sets status to SCAN_FAIL', () => {
			accountDetails.ngOnInit();
			accountDetails.scanFail();
			expect(accountDetails.status).toEqual("SCAN_FAIL");
		});

	});
	
});