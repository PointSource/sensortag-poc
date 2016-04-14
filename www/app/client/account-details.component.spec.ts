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


var sensortag = {
	startScanningForDevices: () => { },
	statusCallback: () => sensortag,
	errorCallback: () => sensortag,
	keypressCallback: () => sensortag,
	temperatureCallback: () => sensortag,
	humidityCallback: () => sensortag,
	connectToNearestDevice: () => { },
	connectToDevice: () => { },
	celsiusToFahrenheit: (celsius) => {
		return (celsius * 9 / 5) + 32
	},
	deviceIsSensorTag: () => { }
};

var sensor = {
	initialize: () => { },
	sensortag: sensortag,
	connectToDevice: () => { },
	setName: () => {}
};

var _evothings = {
		ble: jasmine.createSpyObj("ble", ['connect']),
		easyble: jasmine.createSpyObj("easyble", ['startScan', 'stopScan']),
		tisensortag: {
			createInstance: function() {
				return sensortag
			}
		}
	}

var device = jasmine.createSpyObj('device', [
	'readServiceCharacteristic',
	'readServices',
	'close'
])



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
			useValue: _evothings
		}),
	];
});


describe('Account Details', () => {


	let _accountDetails;
	let _sensorService;
	let _sensorFactory;

	beforeEach(inject(
		[AccountDetailsComponent, SensorService, SensorFactory],
		(accountDetails: AccountDetailsComponent, sensorService: SensorService, sensorFactory: SensorFactory) => {
			_accountDetails = accountDetails;
			_sensorService = sensorService;
			_sensorFactory = sensorFactory;

			spyOn(_sensorService, "getSensorsForPolicy").and.returnValue([{
				policyNumber: "Job1",
				systemId: "MATCHES",
				sensortag: sensortag
			}]);


			spyOn(_sensorFactory, "sensor").and.returnValue(sensor);
		}
	))

	describe('on load sensors', () => {

		let sensorService;

		beforeEach(inject(
			[SensorService],
			(_sensorService: SensorService) => {
				sensorService = _sensorService;
				spyOn(_accountDetails, "scanForSensors");
				_accountDetails.ngOnInit();
				_accountDetails.loadSensors();
			}
		))

		it('calls sensorService.getSensorsForPolicy with this policy number', () => {
			expect(sensorService.getSensorsForPolicy).toHaveBeenCalledWith(_accountDetails.job.policyNumber);
		});

		it('calls scanForSensors', () => {
			expect(_accountDetails.scanForSensors).toHaveBeenCalled();
		});

	})


	describe('on scan for sensors', () => {

		beforeEach(() => {
			_accountDetails.ngOnInit();
			_accountDetails.scanForSensors();
		})

		it('calls easyble.scan', () => {
			console.log(_evothings);
			expect(_evothings.easyble.startScan).toHaveBeenCalled();
		});


		it('sets status to scanning', () => {
			expect(_accountDetails.status).toEqual("SCANNING");
		});

	});


	describe('on stop scan', () => {

		it('calls easyble.stopScan', () => {
			_accountDetails.ngOnInit();
			_accountDetails.stopScanning();
			expect(_evothings.easyble.stopScan).toHaveBeenCalled();
		});

	});



	describe('when device is connected', () => {

		beforeEach(() => {
			_accountDetails.ngOnInit();
			_accountDetails.loadSensors();
		})

		describe("if the system id matches,", () => {

			it('adds the device to the list of matches', () => {
				_accountDetails.gotSystemId("MATCHES", device);
				expect(_accountDetails.sensors.length).toBeGreaterThan(0);
			});

			it('connects to the device using the sensor that matches', () => {
				spyOn(sensor, "connectToDevice");
				_accountDetails.gotSystemId("MATCHES", device);
				expect(sensor.connectToDevice).toHaveBeenCalled();
			});
		})


		describe('if system id does not match', () => {

			beforeEach(() => {
				_accountDetails.gotSystemId("NOT A MATCH", device);
			});

			it('does not add it to the list', () => {
				expect(_accountDetails.sensors.length).toEqual(0);
			});

			it('disconnects from device', () => {
				expect(device.close).toHaveBeenCalled();
			});
		})



	});

	describe('on scan fail', () => {

		it('sets status to SCAN_FAIL', () => {
			_accountDetails.ngOnInit();
			_accountDetails.scanFail();
			expect(_accountDetails.status).toEqual("SCAN_FAIL");
		});

	});
	
});