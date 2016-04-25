// describe('on connectToNearestDevice', () => {
// 	xit('creates a sensorTag instance to track device information', () => {
// 		spyOn(evothings.tisensortag, "createInstance").and.callThrough();
// 		configureJob.connectToNearestDevice();
// 		expect(evothings.tisensortag.createInstance).toHaveBeenCalled();
// 	});

// 	xit('calls sensortag.connectToNearestDevice', () => {
// 		spyOn(sensortag, "connectToNearestDevice");
// 		configureJob.connectToNearestDevice();
// 		expect(sensortag.connectToNearestDevice).toHaveBeenCalled();
// 	});
// });

// describe('when device is connected', () => {

// 	it('sets humidity callback on sensortag', () => {
// 		spyOn(sensortag, "humidityCallback").and.returnValue(sensortag);
// 		configureJob.deviceConnectedHandler(sensortag);
// 		expect(sensortag.humidityCallback).toHaveBeenCalled();
// 	})

// 	it('sets keypress callback on sensortag', () => {
// 		spyOn(sensortag, "keypressCallback").and.returnValue(sensortag);
// 		configureJob.deviceConnectedHandler(sensortag);
// 		expect(sensortag.keypressCallback).toHaveBeenCalled();
// 	})
// })


// describe('on error connecting', () => {

// 	beforeEach(() => {
// 		evothings.easyble = {
// 			error: {
// 				DISCONNECTED: "EASYBLE_ERROR_DISCONNECTED"
// 			}
// 		}
// 	})

// 	it('should update status to display error', () => {
// 		configureJob.errorHandler("OOPS");
// 		expect(configureJob.status).toBe("ERROR");
// 	});

// 	it('if device is disconnected, clear the display values', () => {
// 		spyOn(configureJob, "resetSensorDisplayValues");
// 		configureJob.errorHandler("EASYBLE_ERROR_DISCONNECTED");
// 		expect(configureJob.resetSensorDisplayValues).toHaveBeenCalled();
// 	});
// });


// describe('on humidity callback', () => {

// 	beforeEach(() => {
// 		configureJob.ngOnInit();
// 		configureJob.deviceConnectedHandler(sensortag, 0);

// 		sensortag.getHumidityValues = function() {
// 			return {
// 				humidityTemperature: 75,
// 				relativeHumidity: 90
// 			}
// 		}

// 		configureJob.humidityHandler(configureJob.sensors[0]);
// 	})

// 	it('should update humidityData for this device', () => {
// 		expect(configureJob.sensors[0].data.humidityData)
// 			.toEqual({
// 				lastTenValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 90],
// 				relativeHumidity: '90.0'
// 			});
// 	});

// 	it('should update last 10 humidity data for this device', () => {
// 		expect(configureJob.sensors[0].data.humidityData.lastTenValues)
// 			.toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 90]);
// 	});


// });

// describe('on keypress callback', () => {

// 	beforeEach(() => {
// 		configureJob.ngOnInit();
// 		configureJob.deviceConnectedHandler(sensortag, 0);
// 		configureJob.keypressHandler(configureJob.sensors[0], [1]);
// 	})

// 	it('should update keypressData for this device', () => {
// 		expect(configureJob.sensors[0].data.keypressData)
// 			.toEqual(1);
// 	});
// });
