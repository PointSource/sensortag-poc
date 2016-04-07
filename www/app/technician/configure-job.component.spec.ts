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
	let sensorListComponent;

	beforeEach(() => {
		_sensorService = new SensorService(_http);
		_jobService = new JobService(_sensorService);

		spyOn(_jobService, "getJob").and.returnValue({
			policyNumber: "Job1",
			name: "Andrew Mortensen",
			numSensors: 0
		})
		sensorListComponent = new ConfigureJobComponent(
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
			sensorListComponent._sensorService.addSensor({
				address: "address123"
			});
			spyOn(sensorListComponent._sensorService, "getSensorsForPolicy").and.callThrough();
			sensorListComponent.ngOnInit();
			expect(sensorListComponent._sensorService.getSensorsForPolicy).toHaveBeenCalled();
			expect(sensorListComponent.sensors.length).toBe(1);
		});
	});

	describe('on connectToNearestDevice', () => {
		it('creates a sensorTag instance to track device information', () => {
			spyOn(evothings.tisensortag, "createInstance").and.callThrough();
			sensorListComponent.connectToNearestDevice();
			expect(evothings.tisensortag.createInstance).toHaveBeenCalled();
		});

		it('calls sensortag.connectToNearestDevice', () => {
			spyOn(sensortag, "connectToNearestDevice");
			sensorListComponent.connectToNearestDevice();
			expect(sensortag.connectToNearestDevice).toHaveBeenCalled();
		});
	});

	describe('when device is connected', () => {

		beforeEach(() => {
			sensorListComponent.ngOnInit();
		})

		it('adds the sensortag to the list of connected devices', () => {
			spyOn(sensorListComponent._sensorService, "addSensor").and.callThrough();
			sensorListComponent.deviceConnectedHandler(sensortag);
			expect(sensorListComponent._sensorService.addSensor).toHaveBeenCalled();
			expect(sensorListComponent.sensors[0].sensortag)
				.toEqual(sensortag);
			expect(sensorListComponent.sensors[0].isNamed)
				.toBe(true);
			expect(sensorListComponent.sensors[0].data.humidityData.lastTenValues)
				.toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		})

		it('sets humidity callback on sensortag', () => {
			spyOn(sensortag, "humidityCallback").and.returnValue(sensortag);
			sensorListComponent.deviceConnectedHandler(sensortag);
			expect(sensortag.humidityCallback).toHaveBeenCalled();
		})

		it('sets keypress callback on sensortag', () => {
			spyOn(sensortag, "keypressCallback").and.returnValue(sensortag);
			sensorListComponent.deviceConnectedHandler(sensortag);
			expect(sensortag.keypressCallback).toHaveBeenCalled();
		})

	});

	describe('on initial status update', () => {



		it('should update main status', () => {
			sensorListComponent.ngOnInit();
			spyOn(sensorListComponent.modalElement, "foundation");
			sensorListComponent.initialStatusHandler(sensortag, "SCANNING");
			expect(sensorListComponent.status).toBe("SCANNING");
		});


		it('should update status percentage', () => {
			sensorListComponent.ngOnInit();
			sensorListComponent.initialStatusHandler(sensortag, "SCANNING");
			expect(sensorListComponent.statusPercentage).toBe(20);
			sensorListComponent.initialStatusHandler(sensortag, "SENSORTAG_FOUND");
			expect(sensorListComponent.statusPercentage).toBe(40);
			sensorListComponent.initialStatusHandler(sensortag, "CONNECTING");
			expect(sensorListComponent.statusPercentage).toBe(60);
			sensorListComponent.initialStatusHandler(sensortag, "READING_DEVICE_INFO");
			expect(sensorListComponent.statusPercentage).toBe(80);
			sensorListComponent.initialStatusHandler(sensortag, "DEVICE_INFO_AVAILABLE");
			expect(sensorListComponent.statusPercentage).toBe(100);
		});

		it('if status is DEVICE_INFO_AVAILABLE add sensortag to connected devices', () => {
			sensorListComponent.ngOnInit();
			spyOn(sensorListComponent, "deviceConnectedHandler");
			sensorListComponent.initialStatusHandler(sensortag, "DEVICE_INFO_AVAILABLE");
			expect(sensorListComponent.deviceConnectedHandler).toHaveBeenCalled();
		});

	});


	describe('when device is named', () => {
		it('sets device.isNamed to true', () => {
			sensorListComponent.ngOnInit();
			sensorListComponent.deviceConnectedHandler(sensortag);
			sensorListComponent.nameSensor("new name");
			expect(sensorListComponent.sensors[0].isNamed).toBe(true);
			expect(sensorListComponent.sensors[0].name).toBe("new name");
		});

	});

	xdescribe('on toggleDeviceConnection', () => {

		beforeEach(() => {
			sensorListComponent.sensors = [{
				sensortag: {
					disconnectDevice: () => { },
					connectToDevice: () => { }
				},
				isConnected: true
			}];
		})

		it('if device is connected, calls disconnectDevice', () => {
			spyOn(sensorListComponent.sensors[0].sensortag, "disconnectDevice");
			sensorListComponent.toggleDeviceConnection(0);
			expect(sensorListComponent.sensors[0].sensortag.disconnectDevice).toHaveBeenCalled();
		});

		it('if device is connected, sets isConnected to false', () => {
			sensorListComponent.toggleDeviceConnection(0);
			expect(sensorListComponent.sensors[0].isConnected).toBe(false);
		})

		it('if device is disconnected, calls connectToDevice', () => {
			spyOn(sensorListComponent.sensors[0].sensortag, "connectToDevice");
			// Disconnect
			sensorListComponent.toggleDeviceConnection(0);
			// Connect
			sensorListComponent.toggleDeviceConnection(0);
			expect(sensorListComponent.sensors[0].sensortag.connectToDevice).toHaveBeenCalled();
		})

	});

	// update this to report to indv devices
	describe('on status update', () => {

		beforeEach(() => {
			sensorListComponent.ngOnInit();
			sensorListComponent.sensors = [{
				isConnected: false
			}]
		})

		it('should update device status', () => {
			sensorListComponent.statusHandler(sensorListComponent.sensors[0], "SCANNING");
			expect(sensorListComponent.sensors[0].status).toBe("SCANNING");
		});

		it('if status is DEVICE_INFO_AVAILABLE, should set isConnected to true', () => {
			sensorListComponent.statusHandler(sensorListComponent.sensors[0], "DEVICE_INFO_AVAILABLE");
			expect(sensorListComponent.sensors[0].isConnected).toBe(true);
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
			sensorListComponent.errorHandler("OOPS");
			expect(sensorListComponent.status).toBe("ERROR");
		});

		it('if device is disconnected, clear the display values', () => {
			spyOn(sensorListComponent, "resetSensorDisplayValues");
			sensorListComponent.errorHandler("EASYBLE_ERROR_DISCONNECTED");
			expect(sensorListComponent.resetSensorDisplayValues).toHaveBeenCalled();
		});
	});

	describe('on humidity callback', () => {

		beforeEach(() => {
			sensorListComponent.ngOnInit();
			sensorListComponent.deviceConnectedHandler(sensortag, 0);

			sensortag.getHumidityValues = function() {
				return {
					humidityTemperature: 75,
					relativeHumidity: 90
				}
			}

			sensorListComponent.humidityHandler(sensorListComponent.sensors[0]);
		})

		it('should update humidityData for this device', () => {
			expect(sensorListComponent.sensors[0].data.humidityData)
				.toEqual({
					lastTenValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 90],
					relativeHumidity: '90.0'
				});
		});

		it('should update last 10 humidity data for this device', () => {
			expect(sensorListComponent.sensors[0].data.humidityData.lastTenValues)
				.toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 90]);
		});


	});

	describe('on keypress callback', () => {

		beforeEach(() => {
			sensorListComponent.ngOnInit();
			sensorListComponent.deviceConnectedHandler(sensortag, 0);
			sensorListComponent.keypressHandler(sensorListComponent.sensors[0], [1]);
		})

		it('should update keypressData for this device', () => {
			expect(sensorListComponent.sensors[0].data.keypressData)
				.toEqual(1);
		});
	});

});