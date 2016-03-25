import {NgZone} from 'angular2/core';
import {AppComponent} from "./app.component"

var sensortag;
var tisensortag;

beforeEach(() => {
	sensortag = {
		statusCallback: function() { return this },
		errorCallback: function() { },
	};

	tisensortag = {
		createInstance: function() {
			return sensortag
		}
	}
})


describe('Appcomponent', () => {
	let ngZone: NgZone;
	
	it('initializes sensor tag', () => {
		spyOn(tisensortag, "createInstance").and.returnValue(sensortag);
		let appComponent = new AppComponent({
			tisensortag: tisensortag
		}, ngZone);
		expect(tisensortag.createInstance).toHaveBeenCalled();
	});


	it('initializes callbacks on the sensor tag', () => {
		spyOn(sensortag, "statusCallback").and.returnValue(sensortag);
		spyOn(sensortag, "errorCallback").and.returnValue(sensortag);
		let appComponent = new AppComponent({
			tisensortag: tisensortag
		}, ngZone);
		expect(sensortag.statusCallback).toHaveBeenCalled();
		expect(sensortag.errorCallback).toHaveBeenCalled();
	});


});