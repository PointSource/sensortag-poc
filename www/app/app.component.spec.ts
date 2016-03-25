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
		connectToNearestDevice: () => {},
		isLuxometerAvailable: () => true
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
			expect(evothings.tisensortag.createInstance).toHaveBeenCalled();
		});


		it('initializes callbacks on the sensor tag', () => {
			spyOn(sensortag, "statusCallback").and.returnValue(sensortag);
			spyOn(sensortag, "errorCallback").and.returnValue(sensortag);
			spyOn(sensortag, "keypressCallback").and.returnValue(sensortag);
			spyOn(sensortag, "temperatureCallback").and.returnValue(sensortag);
			spyOn(sensortag, "humidityCallback").and.returnValue(sensortag);
			let appComponent = new AppComponent(evothings, ngZone);
			expect(appComponent.sensortag.statusCallback).toHaveBeenCalled();
			expect(appComponent.sensortag.errorCallback).toHaveBeenCalled();
			expect(appComponent.sensortag.keypressCallback).toHaveBeenCalled();
			expect(appComponent.sensortag.temperatureCallback).toHaveBeenCalled();
			expect(appComponent.sensortag.humidityCallback).toHaveBeenCalled();
		});
	});


	describe('on click connect', () => {

		it('calls connectToNearestDevice', () => {
			spyOn(sensortag, "connectToNearestDevice");
			let appComponent = new AppComponent(evothings, ngZone);
			appComponent.connect();
			expect(appComponent.sensortag.connectToNearestDevice).toHaveBeenCalled();
		});

	});


	describe('on status update', () => {

		it('should update status display to match', () => {
			let appComponent = new AppComponent(evothings, ngZone);
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



	describe('on keypress', () => {
		let appComponent;

		beforeEach(() => {
			appComponent = new AppComponent(evothings, ngZone);
		})

		it('should update keypressData', () => {
			appComponent.keypressHandler("12345");
			expect(appComponent.keypressData).toBe("raw: 0x" + "01");
		});

		it('should set currentKey to match which key was pressed', () => {
			appComponent.keypressHandler("12345");
			expect(appComponent.currentKey).toBe("1");
		});
	});


});