import {NgZone} from 'angular2/core';
import {AppComponent} from "./app.component"


describe('Appcomponent', () => {
	let ngZone:NgZone

	beforeEach(() => {
	})

	it('initializes sensor tag', () => {
		let appComponent = new AppComponent(ngZone);
		expect(true).toEqual(true);
	});

});