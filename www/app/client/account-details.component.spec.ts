import {NgZone, Injector} from 'angular2/core';
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
	let _injector;

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
			startScanningForDevices: () => {},
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

		_injector = jasmine.createSpyObj("_injector", ["get"]);
		_injector.get.and.returnValue({
			initialize: () => {},
			sensortag: sensortag
		})

		spyOn(_jobService, "getJob").and.returnValue({
			policyNumber: "Job1",
			name: "Andrew Mortensen",
			numSensors: 0
		})

		spyOn(_sensorService, "getSensorsForPolicy").and.returnValue([{
			policyNumber: "Job1",
			systemId: "MATCHES",
			sensortag: sensortag
		}]);


		spyOn(_sensorService, "fetch").and.returnValue({
			add: (callback) => {
				callback();
			}
		});

		accountDetails = new AccountDetailsComponent(
			_sensorService,
			_jobService,
			_bleService,
			_navService,
			_routeParams,
			_evothings,
			_ngZone,
			_injector
		);
	})

	describe('on load sensors', () => {

		beforeEach(() => {
			spyOn(accountDetails, "scanForSensors");
			accountDetails.ngOnInit();
			accountDetails.loadSensors();
		})

		it('calls sensorService.getSensorsForPolicy with this policy number', () => {
			expect(_sensorService.getSensorsForPolicy).toHaveBeenCalledWith(accountDetails.job.policyNumber);
		});

		it('calls scanForSensors', () => {
			expect(accountDetails.scanForSensors).toHaveBeenCalled();
		})

	})


	describe('on scan for sensors', () => {

		beforeEach(() => {
			accountDetails.ngOnInit();
			accountDetails.scanForSensors();
		})

		xit('loops through sensors and scans for devices', () => {
			expect(accountDetails.sensors[0].sensortag.startScanningForDevices).toHaveBeenCalled();
		})


		it('calls easyble.scan', () => {
			expect(_evothings.easyble.startScan).toHaveBeenCalled();
		});


		it('sets status to scanning', () => {
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



	describe('when device is connected', () => {

		beforeEach(() => {
			accountDetails.ngOnInit();
			accountDetails.loadSensors();
		})

		describe("if the system id matches,", () => {

			it('adds the device to the list of matches', () => {
				accountDetails.gotSystemId("MATCHES", device);
				expect(accountDetails.sensors.length).toBeGreaterThan(0);
			});

			xit('connects to the device using the sensor that matches', () => {
				spyOn(accountDetails.sensors[0].sensortag, "connectToDevice");
				accountDetails.gotSystemId("MATCHES", device);
				expect(accountDetails.sensors[0].sensortag.connectToDevice).toHaveBeenCalled();
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

	describe('on scan fail', () => {

		it('sets status to SCAN_FAIL', () => {
			accountDetails.ngOnInit();
			accountDetails.scanFail();
			expect(accountDetails.status).toEqual("SCAN_FAIL");
		});

	});
	
});