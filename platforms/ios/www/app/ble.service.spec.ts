	// Put this into the tests for BLE SERVICE
	// describe('on scan success', () => {

	// 	beforeEach(() => {
	// 		accountDetails.ngOnInit();
	// 	})

	// 	xit('checks if the device is a sensortag', () => {
	// 		spyOn(accountDetails.sensortag, "deviceIsSensorTag");
	// 		accountDetails.scanSuccess();
	// 		expect(accountDetails.sensortag.deviceIsSensorTag).toHaveBeenCalled();
	// 	});

	// 	xit('if the device is a sensortag, connect to it', () => {
	// 		let device = jasmine.createSpyObj('device', ['connect'])
	// 		spyOn(accountDetails.sensortag, "deviceIsSensorTag").and.returnValue(true);
	// 		accountDetails.scanSuccess(device);
	// 		expect(accountDetails.status).toEqual("CONNECTING");
	// 		expect(device.connect).toHaveBeenCalled();
	// 	});
	// });