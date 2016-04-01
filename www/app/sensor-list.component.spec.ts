import {NgZone} from 'angular2/core';
import {Router} from 'angular2/router';
import {Http} from 'angular2/http';
import {SensorService} from './sensor.service';
import {SensorListComponent} from "./sensor-list.component"

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
	let ngZone: NgZone;
	let router: Router;
	let _http: Http;
	let sensorService: SensorService;
	let sensorListComponent;

	beforeEach(() => {
		sensorService = new SensorService(_http);
		sensorListComponent = new SensorListComponent(
			sensorService,
			iotFoundationLib, 
			evothings, 
			ngZone, 
			{
				navigate: () => {}
			}
		);
	})

	describe('on init', () => {

		it('initializes IoT Foundation connection', () => {
			spyOn(iotFoundationLib, "createInstance").and.callThrough();
			sensorListComponent.ngOnInit();
			expect(iotFoundationLib.createInstance).toHaveBeenCalled();
		});

		it('fills list with any devices that were saved', () => {
			sensorListComponent._sensorService.addSensor({
				address: "address123"
			});
			spyOn(sensorListComponent._sensorService, "getSensors").and.callThrough();
			sensorListComponent.ngOnInit();
			expect(sensorListComponent._sensorService.getSensors).toHaveBeenCalled();
			expect(sensorListComponent.connectedDevices.length).toBe(1);
		});
	});

	describe('on connectToNearestDevice', () => {
		it('creates a sensorTag instance to track device information', () => {
			spyOn(sensorListComponent, "initSensorTag").and.callThrough();
			sensorListComponent.connectToNearestDevice();
			expect(sensorListComponent.initSensorTag).toHaveBeenCalled();
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

		it('gets the address of the device', () => {
			spyOn(sensortag, "getDeviceAddress");
			sensorListComponent.deviceConnectedHandler(sensortag);
			expect(sensortag.getDeviceAddress).toHaveBeenCalled();
		})

		it('adds the sensortag to the list of connected devices', () => {
			spyOn(sensorListComponent._sensorService, "addSensor").and.callThrough();
			sensorListComponent.deviceConnectedHandler(sensortag);
			expect(sensorListComponent._sensorService.addSensor).toHaveBeenCalled();
			expect(sensorListComponent.connectedDevices[0].sensortag)
				.toEqual(sensortag);
			expect(sensorListComponent.connectedDevices[0].isNamed)
				.toBe(false);
			expect(sensorListComponent.connectedDevices[0].data.humidityData.lastTenValues)
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
			sensorListComponent.nameDevice(sensorListComponent.connectedDevices[0], "new name");
			expect(sensorListComponent.connectedDevices[0].isNamed).toBe(true);
			expect(sensorListComponent.connectedDevices[0].name).toBe("new name");
		});

	});

	describe('on toggleDeviceConnection', () => {

		beforeEach(() => {
			sensorListComponent.connectedDevices = [{
				sensortag: {
					disconnectDevice: () => { },
					connectToDevice: () => { }
				},
				isConnected: true
			}];
		})

		it('if device is connected, calls disconnectDevice', () => {
			spyOn(sensorListComponent.connectedDevices[0].sensortag, "disconnectDevice");
			sensorListComponent.toggleDeviceConnection(0);
			expect(sensorListComponent.connectedDevices[0].sensortag.disconnectDevice).toHaveBeenCalled();
		});

		it('if device is connected, sets isConnected to false', () => {
			sensorListComponent.toggleDeviceConnection(0);
			expect(sensorListComponent.connectedDevices[0].isConnected).toBe(false);
		})

		it('if device is disconnected, calls connectToDevice', () => {
			spyOn(sensorListComponent.connectedDevices[0].sensortag, "connectToDevice");
			// Disconnect
			sensorListComponent.toggleDeviceConnection(0);
			// Connect
			sensorListComponent.toggleDeviceConnection(0);
			expect(sensorListComponent.connectedDevices[0].sensortag.connectToDevice).toHaveBeenCalled();
		})

	});

	// update this to report to indv devices
	describe('on status update', () => {

		beforeEach(() => {
			sensorListComponent.ngOnInit();
			sensorListComponent.connectedDevices = [{
				isConnected: false
			}]
		})

		it('should update device status', () => {
			sensorListComponent.statusHandler(0, "SCANNING");
			expect(sensorListComponent.connectedDevices[0].status).toBe("SCANNING");
		});

		it('if status is DEVICE_INFO_AVAILABLE, should set isConnected to true', () => {
			sensorListComponent.statusHandler(0, "DEVICE_INFO_AVAILABLE");
			expect(sensorListComponent.connectedDevices[0].isConnected).toBe(true);
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
			expect(sensorListComponent.status).toBe("Error: " + "OOPS");
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

			spyOn(sensorListComponent.objIOT, "publishToFoundationCloud");
			sensorListComponent.humidityHandler(0);
		})

		it('should update humidityData for this device', () => {
			expect(sensorListComponent.connectedDevices[0].data.humidityData)
				.toEqual({
					humidityTemperature: '75.0',
					relativeHumidity: '90.0',
					lastTenValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 90]
				});
		});

		it('should update last 10 humidity data for this device', () => {
			expect(sensorListComponent.connectedDevices[0].data.humidityData.lastTenValues)
				.toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 90]);
		});

		it('should send sensor data to the service', () => {
			expect(sensorListComponent.objIOT.publishToFoundationCloud).toHaveBeenCalled();
		});


	});

	describe('on keypress callback', () => {

		beforeEach(() => {
			sensorListComponent.ngOnInit();
			sensorListComponent.deviceConnectedHandler(sensortag, 0);
			sensorListComponent.keypressHandler(0, [1]);
		})

		it('should update keypressData for this device', () => {
			expect(sensorListComponent.connectedDevices[0].data.keypressData)
				.toEqual(1);
		});
	});

	describe('on opening details', () => {

		it('should route to SensorDetail', () => {
			spyOn(sensorListComponent._router, "navigate");
			sensorListComponent.goToSensorDetails(0);
			expect(sensorListComponent._router.navigate).toHaveBeenCalledWith([
				'SensorDetail', { 'index': 0 }
			]);
		})
	});

});