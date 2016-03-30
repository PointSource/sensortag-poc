import {NgZone} from 'angular2/core';
import {AppComponent} from "./app.component"

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



describe('Appcomponent', () => {
	let ngZone: NgZone;
	let appComponent;

	beforeEach(() => {
		appComponent = new AppComponent(iotFoundationLib, evothings, ngZone);
	})

	describe('on create', () => {

		it('initializes IoT Foundation connection', () => {
			spyOn(iotFoundationLib, "createInstance").and.callThrough();
			appComponent.ngOnInit();
			expect(iotFoundationLib.createInstance).toHaveBeenCalled();
		});
	});

	describe('on connectToNearestDevice', () => {
		it('creates a sensorTag instance to track device information', () => {
			spyOn(appComponent, "initSensorTag").and.callThrough();
			appComponent.connectToNearestDevice();
			expect(appComponent.initSensorTag).toHaveBeenCalled();
		});

		it('calls sensortag.connectToNearestDevice', () => {
			spyOn(sensortag, "connectToNearestDevice");
			appComponent.connectToNearestDevice();
			expect(sensortag.connectToNearestDevice).toHaveBeenCalled();
		});
	});

	describe('when device is connected', () => {

		beforeEach(() => {
			appComponent.ngOnInit();
		})

		it('gets the address of the device', () => {
			spyOn(sensortag, "getDeviceAddress");
			appComponent.deviceConnectedHandler(sensortag);
			expect(sensortag.getDeviceAddress).toHaveBeenCalled();
		})

		it('adds the sensortag to the list of connected devices', () => {
			appComponent.deviceConnectedHandler(sensortag);
			expect(appComponent.connectedDevices[0].sensortag)
				.toEqual(sensortag);
			expect(appComponent.connectedDevices[0].isNamed)
				.toBe(false);

		})

		it('sets humidity callback on sensortag', () => {
			spyOn(sensortag, "humidityCallback").and.returnValue(sensortag);
			appComponent.deviceConnectedHandler(sensortag);
			expect(sensortag.humidityCallback).toHaveBeenCalled();
		})
	});

	describe('on initial status update', () => {

		it('should update main status', () => {
			appComponent.ngOnInit();
			appComponent.initialStatusHandler(sensortag, "SCANNING");
			expect(appComponent.status).toBe("SCANNING");
		});


		it('should update status percentage', () => {
			appComponent.ngOnInit();
			appComponent.initialStatusHandler(sensortag, "SCANNING");
			expect(appComponent.statusPercentage).toBe(20);
			appComponent.initialStatusHandler(sensortag, "SENSORTAG_FOUND");
			expect(appComponent.statusPercentage).toBe(40);
			appComponent.initialStatusHandler(sensortag, "CONNECTING");
			expect(appComponent.statusPercentage).toBe(60);
			appComponent.initialStatusHandler(sensortag, "READING_DEVICE_INFO");
			expect(appComponent.statusPercentage).toBe(80);
			appComponent.initialStatusHandler(sensortag, "DEVICE_INFO_AVAILABLE");
			expect(appComponent.statusPercentage).toBe(100);
		});

		it('if status is DEVICE_INFO_AVAILABLE add sensortag to connected devices', () => {
			appComponent.ngOnInit();
			spyOn(appComponent, "deviceConnectedHandler");
			appComponent.initialStatusHandler(sensortag, "DEVICE_INFO_AVAILABLE");
			expect(appComponent.deviceConnectedHandler).toHaveBeenCalled();
		});

	});


	describe('when device is named', () => {
		it('sets device.isNamed to true', () => {
			appComponent.ngOnInit();
			appComponent.deviceConnectedHandler(sensortag);
			appComponent.nameDevice(appComponent.connectedDevices[0], "new name");
			expect(appComponent.connectedDevices[0].isNamed).toBe(true);
			expect(appComponent.connectedDevices[0].name).toBe("new name");
		});

	});

	describe('on click disconnectFromDevice', () => {

		beforeEach(() => {
			appComponent.connectedDevices = [{
				sensortag: {
					disconnectDevice: () => { }
				}
			}];
		})

		it('calls disconnectDevice', () => {
			spyOn(appComponent.connectedDevices[0].sensortag, "disconnectDevice");
			appComponent.disconnectFromDevice(0);
			expect(appComponent.connectedDevices[0].sensortag.disconnectDevice).toHaveBeenCalled();
		});

	});

	// update this to report to indv devices
	describe('on status update', () => {

		beforeEach(() => {
			appComponent.ngOnInit();
			appComponent.connectedDevices = [{}]
		})

		it('should update device status', () => {
			appComponent.statusHandler(0, "SCANNING");
			expect(appComponent.connectedDevices[0].status).toBe("SCANNING");
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
			appComponent.errorHandler("OOPS");
			expect(appComponent.status).toBe("Error: " + "OOPS");
		});

		it('if device is disconnected, clear the display values', () => {
			spyOn(appComponent, "resetSensorDisplayValues");
			appComponent.errorHandler("EASYBLE_ERROR_DISCONNECTED");
			expect(appComponent.resetSensorDisplayValues).toHaveBeenCalled();
		});
	});

	describe('on humidity callback', () => {

		beforeEach(() => {
			appComponent.ngOnInit();
			appComponent.deviceConnectedHandler(sensortag, 0);

			sensortag.getHumidityValues = function() {
				return {
					humidityTemperature: 75,
					relativeHumidity: 90
				}
			}

			spyOn(appComponent.objIOT, "publishToFoundationCloud");
			appComponent.humidityHandler(0);
		})

		it('should update humidityData for this device', () => {
			expect(appComponent.connectedDevices[0].data.humidityData)
				.toEqual({
					humidityTemperature: '75.0',
					relativeHumidity: '90.0'
				});
		});


		it('should send sensor data to the service', () => {
			expect(appComponent.objIOT.publishToFoundationCloud).toHaveBeenCalled();
		});


	});



});