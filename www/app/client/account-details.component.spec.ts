import {NgZone} from 'angular2/core';
import {SensorService} from "../sensor.service"
import {JobService} from "../technician/job.service"
import {Http} from 'angular2/http';

import {AccountDetailsComponent} from "./account-details.component"

describe('Account Details', () => {
	let _sensorService: SensorService;
	let _jobService: JobService;
	let _navService = jasmine.createSpyObj("_navService", ['setTitle']);
	let _bleService = jasmine.createSpyObj("_bleService", ['deviceConnectSuccess']);
	let _http: Http;
	let _routeParams = jasmine.createSpyObj("_routeParams", ['get']);
	let accountDetails;
	let _ngZone: NgZone;

	let _evothings;
	let sensortag;
	let device;

	beforeEach( () => {
		_sensorService = new SensorService(_http);
		_jobService = new JobService(_sensorService);

		device = jasmine.createSpyObj('device', [
			'readServiceCharacteristic',
			'readServices',
			'close'
		])


		sensortag = {
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
			deviceIsSensorTag: () => {}
		};

		_evothings = {
			ble: jasmine.createSpyObj("ble", ['connect']),
			easyble: jasmine.createSpyObj("easyble", ['startScan', 'stopScan']),
			tisensortag: {
				createInstance: function() {
					return sensortag
				}
			}
		}

		spyOn(_jobService, "getJob").and.returnValue({
			policyNumber: "Job1",
			name: "Andrew Mortensen",
			numSensors: 0
		})

		accountDetails = new AccountDetailsComponent(
			_sensorService,
			_jobService,
			_bleService,
			_navService,
			_routeParams,
			_evothings,
			_ngZone
		);
	})


	describe('on scan for sensors', () => {

		it('calls easyble.scan', () => {
			accountDetails.ngOnInit();
			accountDetails.scanForSensors();
			expect(_evothings.easyble.startScan).toHaveBeenCalled();
		});


		it('sets status to scanning', () => {
			accountDetails.ngOnInit();
			accountDetails.scanForSensors();
			expect(accountDetails.status).toEqual("SCANNING");
		});

	});


	describe('on stop scan', () => {

		it('calls easyble.stopScan', () => {
			accountDetails.ngOnInit();
			accountDetails.stopScanning();
			expect(_evothings.easyble.stopScan).toHaveBeenCalled();
		});

	});

	describe('on scan success', () => {

		beforeEach(() => {
			accountDetails.ngOnInit();
		})

		xit('checks if the device is a sensortag', () => {
			spyOn(accountDetails.sensortag, "deviceIsSensorTag");
			accountDetails.scanSuccess();
			expect(accountDetails.sensortag.deviceIsSensorTag).toHaveBeenCalled();
		});

		xit('if the device is a sensortag, connect to it', () => {
			let device = jasmine.createSpyObj('device', ['connect'])
			spyOn(accountDetails.sensortag, "deviceIsSensorTag").and.returnValue(true);
			accountDetails.scanSuccess(device);
			expect(accountDetails.status).toEqual("CONNECTING");
			expect(device.connect).toHaveBeenCalled();
		});
	});

	describe('when device is connected', () => {

		beforeEach(() => {
			accountDetails.ngOnInit();
		})

		xit('gets its system id', () => {
			accountDetails.deviceConnectSuccess(device);
			expect(device.readServices).toHaveBeenCalled();
		});


		it('compares system id to existing sensors', () => {
			accountDetails.gotSystemId("0212d3000048b4b0", device);
			expect(accountDetails.matchingDevices.length).toBeGreaterThan(0);
		});

		describe('if system id does not match', () => {

			beforeEach(() => {
				accountDetails.gotSystemId("NOT A MATCH", device);
			});

			it('doesn\'t add it to the list', () => {
				expect(accountDetails.matchingDevices.length).toEqual(0);
			});

			it('disconnects from device', () => {
				expect(device.close).toHaveBeenCalled();
			});
		})


		xit('if the system id matches, connect to the device using the sensor that matches', () => {

		});

	});

	describe('on scan fail', () => {

		it('sets status to SCAN_FAIL', () => {
			accountDetails.ngOnInit();
			accountDetails.scanFail();
			expect(accountDetails.status).toEqual("SCAN_FAIL");
		});

	});
	
});