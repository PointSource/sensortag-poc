import {NgZone} from 'angular2/core';
import {AppComponent} from "./app.component"

var sensortag;
var tisensortag;
var evothings;

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
})


describe('Appcomponent', () => {
	let ngZone: NgZone;


	describe('on create', () => {

		it('initializes sensor tag', () => {
			spyOn(evothings.tisensortag, "createInstance").and.returnValue(sensortag);
			let appComponent = new AppComponent(evothings, ngZone);
			appComponent.ngOnInit();
			expect(evothings.tisensortag.createInstance).toHaveBeenCalled();
		});


		it('initializes callbacks on the sensor tag', () => {
			let appComponent = new AppComponent(evothings, ngZone);
			spyOn(sensortag, "statusCallback").and.returnValue(sensortag);
			spyOn(sensortag, "errorCallback").and.returnValue(sensortag);
			appComponent.ngOnInit();
			expect(appComponent.sensortag.statusCallback).toHaveBeenCalled();
			expect(appComponent.sensortag.errorCallback).toHaveBeenCalled();
		});
	});



	describe('on scan', () => {
		let appComponent;

		beforeEach(() => {
			sensortag.startScanningForDevices = () => { };
			appComponent = new AppComponent(evothings, ngZone);
			appComponent.ngOnInit();
		});

		it('calls startScanningForDevices', () => {
			spyOn(sensortag, "startScanningForDevices");
			appComponent.scan();
			expect(sensortag.startScanningForDevices).toHaveBeenCalled();
		});

		describe("when foundSensorTag fires", () => {
			beforeEach(() => {
				expect(appComponent.availableDevices.length).toEqual(0);
				sensortag.deviceIsSensorTag = (device) => {
					return device.model === "CC2650"
				}
			})

			it('if this is NOT a sensortag, should NOT add device to list', () => {
				appComponent.onFoundDevice({
					type: "SensorTag",
					model: "Wrong Model",
					address: "address123"
				});
				expect(appComponent.availableDevices.length).toEqual(0);
			});

			it('if this is a sensortag, should add device to list', () => {
				appComponent.onFoundDevice({
					type: "SensorTag",
					model: "CC2650",
					address: "address123"
				});
				expect(appComponent.availableDevices.length).toEqual(1);
			});


			it('if it finds the same device twice, it should NOT add it over again', () => {
				appComponent.onFoundDevice({
					type: "SensorTag",
					model: "CC2650",
					address: "address123"
				}); 
				appComponent.onFoundDevice({
					type: "SensorTag",
					model: "CC2650",
					address: "address123"
				});
				expect(appComponent.availableDevices.length).toEqual(1);
			});


			it('if it finds the two different devices, it should add both', () => {
				appComponent.onFoundDevice({
					type: "SensorTag",
					model: "CC2650",
					address: "address123"
				});
				appComponent.onFoundDevice({
					type: "SensorTag",
					model: "CC2650",
					address: "address456"
				});
				expect(appComponent.availableDevices.length).toEqual(2);
			});
		})

	})


	describe('on stop scan', () => {
		let appComponent;

		beforeEach(() => {
			sensortag.stopScanningForDevices = () => { };
			appComponent = new AppComponent(evothings, ngZone);
			appComponent.ngOnInit();
		});


		it('calls stopScanningForDevices', () => {
			spyOn(sensortag, "stopScanningForDevices");
			appComponent.stopScanning();
			expect(sensortag.stopScanningForDevices).toHaveBeenCalled();
		});

	});


	describe('on connect to device', () => {
		let appComponent;

		beforeEach(() => {
			appComponent = new AppComponent(evothings, ngZone);
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




	describe('on click disconnect', () => {

		it('calls disconnectDevice', () => {
			let appComponent = new AppComponent(evothings, ngZone);
			sensortag.disconnectDevice = () => { };
			spyOn(sensortag, "disconnectDevice");
			spyOn(appComponent, "resetSensorDisplayValues");
			appComponent.ngOnInit();
			appComponent.disconnect();
			expect(appComponent.resetSensorDisplayValues).toHaveBeenCalled();
			expect(appComponent.sensortag.disconnectDevice).toHaveBeenCalled();
		});

	});

	describe('on status update', () => {

		it('should update status display to match', () => {
			let appComponent = new AppComponent(evothings, ngZone);
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


			let appComponent = new AppComponent(evothings, ngZone);
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
			let appComponent = new AppComponent(evothings, ngZone);
			appComponent.errorHandler("OOPS");
			expect(appComponent.status).toBe("Error: " + "OOPS");
		});

		it('if device is disconnected, clear the display values', () => {
			let appComponent = new AppComponent(evothings, ngZone);
			spyOn(appComponent, "resetSensorDisplayValues");
			appComponent.errorHandler("EASYBLE_ERROR_DISCONNECTED");
			expect(appComponent.resetSensorDisplayValues).toHaveBeenCalled();
		});
	});

	describe('on humidity callback', () => {
		let appComponent;

		beforeEach(() => {
			appComponent = new AppComponent(evothings, ngZone);
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

			appComponent.humidityHandler({
				address: 'address123'
			});
		})

		it('should update humidityData for this device', () => {
			expect(appComponent.connectedSensorData['address123'].humidityData)
				.toEqual({
					humidityTemperature: 75,
					humidityTemperatureFahrenheit: 167,
					relativeHumidity: 90
				});
		});


	});



	// xdescribe('on click connect', () => {

	// 	it('calls connectToNearestDevice', () => {
	// 		let appComponent = new AppComponent(evothings, ngZone);
	// 		spyOn(sensortag, "connectToNearestDevice");
	// 		appComponent.ngOnInit();
	// 		appComponent.connect();
	// 		expect(appComponent.sensortag.connectToNearestDevice).toHaveBeenCalled();
	// 	});

	// });

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