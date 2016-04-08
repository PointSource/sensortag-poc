import {NgZone, ElementRef} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Http} from 'angular2/http';
import {SensorService} from '../sensor.service';
import {JobService} from './job.service';
import {NavService} from '../nav.service';
import {ConfigureJobComponent} from "./configure-job.component"

var sensortag;
var tisensortag;
var evothings;
var iotFoundationLib;

beforeEach(() => {
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
		getDeviceAddress: () => {
			return "address123"
		},
		getDevice: () => {
			return {
				address: "address123"
			}
		}
	};

	evothings = {
		tisensortag: {
			createInstance: function() {
				return sensortag
			}
		}
	}

	var objIOT = {
		onConnectSuccessCallback: () => { return objIOT },
		onConnectFailureCallback: () => { return objIOT },
		connectToFoundationCloud: () => { return objIOT },
		publishToFoundationCloud: () => { }
	}

	iotFoundationLib = {
		createInstance: () => {
			return objIOT
		}
	}
})



describe('Sensor List Component', () => {
	let _sensorService: SensorService;
	let _jobService: JobService;
	let _navService = jasmine.createSpyObj("_navService", ['setTitle']);
	let _routeParams = jasmine.createSpyObj("_routeParams", ['get']);
	let _elementRef = {
		nativeElement: {
			children: []
		}
	};
	let _jquery = () => { 
		return {
			foundation: ()=>{}
		}
	};
	let _ngZone: NgZone;
	let _foundation = jasmine.createSpyObj("_foundation", ['Reveal']);
	let _http: Http;
	let configureJob;

	beforeEach(() => {
		_sensorService = new SensorService(_http);
		_jobService = new JobService(_sensorService);

		spyOn(_jobService, "getJob").and.returnValue({
			policyNumber: "Job1",
			name: "Andrew Mortensen",
			numSensors: 0
		})
		configureJob = new ConfigureJobComponent(
			_sensorService,
			_jobService,
			_navService,
			_routeParams,
			_elementRef,
			_jquery,
			_foundation,
			evothings, 
			_ngZone
		);
	})

	describe('on init', () => {

		it('fills list with any devices that were saved', () => {
			configureJob._sensorService.addSensor({
				address: "address123"
			});
			spyOn(configureJob._sensorService, "getSensorsForPolicy").and.callThrough();
			configureJob.ngOnInit();
			expect(configureJob._sensorService.getSensorsForPolicy).toHaveBeenCalled();
			expect(configureJob.sensors.length).toBe(1);
		});
	});

	describe('on connectToNearestDevice', () => {
		it('creates a sensorTag instance to track device information', () => {
			spyOn(evothings.tisensortag, "createInstance").and.callThrough();
			configureJob.connectToNearestDevice();
			expect(evothings.tisensortag.createInstance).toHaveBeenCalled();
		});

		it('calls sensortag.connectToNearestDevice', () => {
			spyOn(sensortag, "connectToNearestDevice");
			configureJob.connectToNearestDevice();
			expect(sensortag.connectToNearestDevice).toHaveBeenCalled();
		});
	});

	describe('when device is connected', () => {

		beforeEach(() => {
			configureJob.ngOnInit();
		})

		it('adds the sensortag to the list of connected devices', () => {
			spyOn(configureJob._sensorService, "addSensor").and.callThrough();
			configureJob.deviceConnectedHandler(sensortag);
			expect(configureJob._sensorService.addSensor).toHaveBeenCalled();
			expect(configureJob.sensors[0].sensortag)
				.toEqual(sensortag);
			expect(configureJob.sensors[0].isNamed)
				.toBe(true);
			expect(configureJob.sensors[0].data.humidityData.lastTenValues)
				.toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		})

		it('sets humidity callback on sensortag', () => {
			spyOn(sensortag, "humidityCallback").and.returnValue(sensortag);
			configureJob.deviceConnectedHandler(sensortag);
			expect(sensortag.humidityCallback).toHaveBeenCalled();
		})

		it('sets keypress callback on sensortag', () => {
			spyOn(sensortag, "keypressCallback").and.returnValue(sensortag);
			configureJob.deviceConnectedHandler(sensortag);
			expect(sensortag.keypressCallback).toHaveBeenCalled();
		})

	});

	describe('on initial status update', () => {



		it('should update main status', () => {
			configureJob.ngOnInit();
			spyOn(configureJob.modalElement, "foundation");
			configureJob.initialStatusHandler(sensortag, "SCANNING");
			expect(configureJob.status).toBe("SCANNING");
		});


		it('should update status percentage', () => {
			configureJob.ngOnInit();
			configureJob.initialStatusHandler(sensortag, "SCANNING");
			expect(configureJob.statusPercentage).toBe(20);
			configureJob.initialStatusHandler(sensortag, "SENSORTAG_FOUND");
			expect(configureJob.statusPercentage).toBe(40);
			configureJob.initialStatusHandler(sensortag, "CONNECTING");
			expect(configureJob.statusPercentage).toBe(60);
			configureJob.initialStatusHandler(sensortag, "READING_DEVICE_INFO");
			expect(configureJob.statusPercentage).toBe(80);
			configureJob.initialStatusHandler(sensortag, "DEVICE_INFO_AVAILABLE");
			expect(configureJob.statusPercentage).toBe(100);
		});

		it('if status is DEVICE_INFO_AVAILABLE add sensortag to connected devices', () => {
			configureJob.ngOnInit();
			spyOn(configureJob, "deviceConnectedHandler");
			configureJob.initialStatusHandler(sensortag, "DEVICE_INFO_AVAILABLE");
			expect(configureJob.deviceConnectedHandler).toHaveBeenCalled();
		});

	});


	describe('when device is named', () => {
		it('sets device.isNamed to true', () => {
			configureJob.ngOnInit();
			configureJob.deviceConnectedHandler(sensortag);
			configureJob.nameSensor("new name");
			expect(configureJob.sensors[0].isNamed).toBe(true);
			expect(configureJob.sensors[0].name).toBe("new name");
		});

	});


	// update this to report to indv devices
	describe('on status update', () => {

		beforeEach(() => {
			configureJob.ngOnInit();
			configureJob.sensors = [{
				isConnected: false
			}]
		})

		it('should update device status', () => {
			configureJob.statusHandler(configureJob.sensors[0], "SCANNING");
			expect(configureJob.sensors[0].status).toBe("SCANNING");
		});

		it('if status is DEVICE_INFO_AVAILABLE, should set isConnected to true', () => {
			configureJob.statusHandler(configureJob.sensors[0], "DEVICE_INFO_AVAILABLE");
			expect(configureJob.sensors[0].isConnected).toBe(true);
		});
	});



	describe('on error connecting', () => {

		beforeEach(() => {
			evothings.easyble = {
				error: {
					DISCONNECTED: "EASYBLE_ERROR_DISCONNECTED"
				}
			}
		})

		it('should update status to display error', () => {
			configureJob.errorHandler("OOPS");
			expect(configureJob.status).toBe("ERROR");
		});

		it('if device is disconnected, clear the display values', () => {
			spyOn(configureJob, "resetSensorDisplayValues");
			configureJob.errorHandler("EASYBLE_ERROR_DISCONNECTED");
			expect(configureJob.resetSensorDisplayValues).toHaveBeenCalled();
		});
	});

	describe('on humidity callback', () => {

		beforeEach(() => {
			configureJob.ngOnInit();
			configureJob.deviceConnectedHandler(sensortag, 0);

			sensortag.getHumidityValues = function() {
				return {
					humidityTemperature: 75,
					relativeHumidity: 90
				}
			}

			configureJob.humidityHandler(configureJob.sensors[0]);
		})

		it('should update humidityData for this device', () => {
			expect(configureJob.sensors[0].data.humidityData)
				.toEqual({
					lastTenValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 90],
					relativeHumidity: '90.0'
				});
		});

		it('should update last 10 humidity data for this device', () => {
			expect(configureJob.sensors[0].data.humidityData.lastTenValues)
				.toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 90]);
		});


	});

	describe('on keypress callback', () => {

		beforeEach(() => {
			configureJob.ngOnInit();
			configureJob.deviceConnectedHandler(sensortag, 0);
			configureJob.keypressHandler(configureJob.sensors[0], [1]);
		})

		it('should update keypressData for this device', () => {
			expect(configureJob.sensors[0].data.keypressData)
				.toEqual(1);
		});
	});

});