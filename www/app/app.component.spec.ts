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

		it('initializes sensor tag', () => {
			spyOn(evothings.tisensortag, "createInstance").and.returnValue(sensortag);
			appComponent.ngOnInit();
			expect(evothings.tisensortag.createInstance).toHaveBeenCalled();
		});


		it('initializes callbacks on the sensor tag', () => {
			spyOn(sensortag, "statusCallback").and.returnValue(sensortag);
			spyOn(sensortag, "errorCallback").and.returnValue(sensortag);
			appComponent.ngOnInit();
			expect(appComponent.sensortag.statusCallback).toHaveBeenCalled();
			expect(appComponent.sensortag.errorCallback).toHaveBeenCalled();
		});

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
			sensortag.getDeviceAddress = function() {
				return "address123"
			}
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


	// describe('on scan', () => {
	// 	beforeEach(() => {
	// 		sensortag.startScanningForDevices = () => { };
	// 		appComponent.ngOnInit();
	// 	});

	// 	it('calls startScanningForDevices', () => {
	// 		spyOn(sensortag, "startScanningForDevices");
	// 		appComponent.scan();
	// 		expect(sensortag.startScanningForDevices).toHaveBeenCalled();
	// 	});

	// 	describe("when foundSensorTag fires", () => {
	// 		beforeEach(() => {
	// 			expect(appComponent.knownDevices.length).toEqual(0);
	// 			sensortag.deviceIsSensorTag = (device) => {
	// 				return device.model === "CC2650"
	// 			}
	// 		})

	// 		it('if this is NOT a sensortag, should NOT add device to list', () => {
	// 			appComponent.onFoundDevice({
	// 				type: "SensorTag",
	// 				model: "Wrong Model",
	// 				address: "address123"
	// 			});
	// 			expect(appComponent.knownDevices.length).toEqual(0);
	// 		});

	// 		it('if this is a sensortag, should add device to list', () => {
	// 			appComponent.onFoundDevice({
	// 				type: "SensorTag",
	// 				model: "CC2650",
	// 				address: "address123"
	// 			});
	// 			expect(appComponent.knownDevices.length).toEqual(1);
	// 		});


	// 		it('if it finds the same device twice, it should NOT add it over again', () => {
	// 			appComponent.onFoundDevice({
	// 				type: "SensorTag",
	// 				model: "CC2650",
	// 				address: "address123"
	// 			}); 
	// 			appComponent.onFoundDevice({
	// 				type: "SensorTag",
	// 				model: "CC2650",
	// 				address: "address123"
	// 			});
	// 			expect(appComponent.knownDevices.length).toEqual(1);
	// 		});


	// 		it('if it finds the two different devices, it should add both', () => {
	// 			appComponent.onFoundDevice({
	// 				type: "SensorTag",
	// 				model: "CC2650",
	// 				address: "address123"
	// 			});
	// 			appComponent.onFoundDevice({
	// 				type: "SensorTag",
	// 				model: "CC2650",
	// 				address: "address456"
	// 			});
	// 			expect(appComponent.knownDevices.length).toEqual(2);
	// 		});
	// 	})

	// })


	describe('on stop scan', () => {

		beforeEach(() => {
			sensortag.stopScanningForDevices = () => { };
			appComponent.ngOnInit();
		});


		it('calls stopScanningForDevices', () => {
			spyOn(sensortag, "stopScanningForDevices");
			appComponent.stopScanning();
			expect(sensortag.stopScanningForDevices).toHaveBeenCalled();
		});

	});


	describe('on connect to device', () => {

		beforeEach(() => {
			appComponent.ngOnInit();
		});


		it('calls connectToDevice', () => {
			spyOn(sensortag, "connectToDevice");
			appComponent.connectToDevice({
				type: "SensorTag",
				model: "CC2650",
				address: "address456"
			});
			expect(sensortag.connectToDevice).toHaveBeenCalled();
		});

		it('creates a new sensorTag instance', () => {
			spyOn(appComponent, "createSensorTag").and.callThrough();
			appComponent.connectToDevice({
				type: "SensorTag",
				model: "CC2650",
				address: "address456"
			});
			expect(appComponent.createSensorTag).toHaveBeenCalled();
		})
	})




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

	describe('on status update', () => {

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
			sensortag.getDeviceAddress = function() {
				return "address123"
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
			appComponent.connectToDevice({
				type: "SensorTag",
				model: "CC2650",
				address: "address123"
			});

			sensortag.getHumidityValues = function() {
				return {
					humidityTemperature: 75,
					relativeHumidity: 90
				}
			}

			spyOn(appComponent.objIOT, "publishToFoundationCloud");
			appComponent.humidityHandler('address123');
		})

		it('should update humidityData for this device', () => {
			expect(appComponent.connectedSensorData['address123'].humidityData)
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


	// xdescribe('on keypress', () => {
	// 	let appComponent;

	// 	beforeEach(() => {
	// 		appComponent = new AppComponent(evothings, ngZone);
	// 	})

	// 	it('should update keypressData', () => {
	// 		appComponent.keypressHandler("12345");
	// 		expect(appComponent.keypressData).toBe("raw: 0x" + "01");
	// 	});

	// 	it('should set currentKey to match which key was pressed', () => {
	// 		appComponent.keypressHandler("12345");
	// 		expect(appComponent.currentKey).toBe("1");
	// 	});
	// });

	// xdescribe('on temperature callback', () => {
	// 	let appComponent;

	// 	beforeEach(() => {
	// 		appComponent = new AppComponent(evothings, ngZone);
	// 		appComponent.ngOnInit();
	// 		sensortag.getTemperatureValues = function() {
	// 			return {
	// 				ambientTemperature: 75,
	// 				targetTemperature: 90
	// 			}
	// 		}
	// 	})

	// 	it('should update temperatureData', () => {
	// 		appComponent.temperatureHandler(null);
	// 		expect(appComponent.temperatureData).toBe("+90.00 C (+194.00 F) +75.00 C (+167.00 F) [amb]");
	// 	});

	// });


});