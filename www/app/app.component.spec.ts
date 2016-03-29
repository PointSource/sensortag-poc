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
			expect(appComponent.connectedDevices[0])
				.toEqual(sensortag);
		})

		it('sets humidity callback on sensortag', () => {
			spyOn(sensortag, "humidityCallback").and.returnValue(sensortag);
			appComponent.deviceConnectedHandler(sensortag);
			expect(sensortag.humidityCallback).toHaveBeenCalled();
		})
	});

	describe('on click disconnectFromDevice', () => {

		it('calls disconnectDevice', () => {
			appComponent.connectedDevices = {
				"address123": {
					disconnectDevice: () => {}
				}
			};
			spyOn(appComponent.connectedDevices["address123"], "disconnectDevice");
			appComponent.disconnectFromDevice({
				type: "SensorTag",
				model: "CC2650",
				address: "address123"
			});
			expect(appComponent.connectedDevices["address123"].disconnectDevice).toHaveBeenCalled();
		});

	});

	// update this to report to indv devices
	xdescribe('on status update', () => {

		it('should update status display to match', () => {
			appComponent.ngOnInit();
			appComponent.statusHandler("SCANNING");
			expect(appComponent.status).toBe("SCANNING");
		});


		it('if status is DEVICE_INFO_AVAILABLE update firmware and device model information', () => {
			sensortag.getDeviceModel = function () {
				return "TI Something"
			}
			sensortag.getFirmwareString = function() {
				return "Firmware 123"
			}
			sensortag.isLuxometerAvailable = function() {
				return true;
			}

			appComponent.ngOnInit();
			appComponent.statusHandler("DEVICE_INFO_AVAILABLE");
			expect(appComponent.deviceModel).toBe("TI Something");
			expect(appComponent.firmwareData).toBe("Firmware 123");
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
			expect(appComponent.connectedSensorData[0].humidityData)
				.toEqual({
					humidityTemperature: 75,
					humidityTemperatureFahrenheit: 167,
					relativeHumidity: 90
				});
		});


		it('should send sensor data to the service', () => {
			expect(appComponent.objIOT.publishToFoundationCloud).toHaveBeenCalled();
		});


	});



});