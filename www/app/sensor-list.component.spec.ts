import {NgZone} from 'angular2/core';
import {Router} from 'angular2/router';
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
	let sensorListComponent;

	beforeEach(() => {
		sensorListComponent = new SensorListComponent(iotFoundationLib, evothings, ngZone, {
			navigate: () => {}
		});
	})

	describe('on create', () => {

		it('initializes IoT Foundation connection', () => {
			spyOn(iotFoundationLib, "createInstance").and.callThrough();
			sensorListComponent.ngOnInit();
			expect(iotFoundationLib.createInstance).toHaveBeenCalled();
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
			sensorListComponent.deviceConnectedHandler(sensortag);
			expect(sensorListComponent.connectedDevices[0].sensortag)
				.toEqual(sensortag);
			expect(sensorListComponent.connectedDevices[0].isNamed)
				.toBe(false);

		})

		it('sets humidity callback on sensortag', () => {
			spyOn(sensortag, "humidityCallback").and.returnValue(sensortag);
			sensorListComponent.deviceConnectedHandler(sensortag);
			expect(sensortag.humidityCallback).toHaveBeenCalled();
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

	describe('on click disconnectFromDevice', () => {

		beforeEach(() => {
			sensorListComponent.connectedDevices = [{
				sensortag: {
					disconnectDevice: () => { }
				}
			}];
		})

		it('calls disconnectDevice', () => {
			spyOn(sensorListComponent.connectedDevices[0].sensortag, "disconnectDevice");
			sensorListComponent.disconnectFromDevice(0);
			expect(sensorListComponent.connectedDevices[0].sensortag.disconnectDevice).toHaveBeenCalled();
		});

	});

	// update this to report to indv devices
	describe('on status update', () => {

		beforeEach(() => {
			sensorListComponent.ngOnInit();
			sensorListComponent.connectedDevices = [{}]
		})

		it('should update device status', () => {
			sensorListComponent.statusHandler(0, "SCANNING");
			expect(sensorListComponent.connectedDevices[0].status).toBe("SCANNING");
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
					relativeHumidity: '90.0'
				});
		});


		it('should send sensor data to the service', () => {
			expect(sensorListComponent.objIOT.publishToFoundationCloud).toHaveBeenCalled();
		});


	});

	describe('on opening details', () => {

		it('should route to SensorDetail', () => {
			spyOn(sensorListComponent._router, "navigate");
			sensorListComponent.goToSensorDetails(sensortag);
			expect(sensorListComponent._router.navigate).toHaveBeenCalledWith([
				'SensorDetail', { 'device': sensortag }
			]);
		})
	});

});