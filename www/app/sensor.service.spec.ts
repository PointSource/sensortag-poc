class MockSensorService extends SensorService {
	sensors = [{
		systemId: "1234",
		policyNumber: "Job1",
		name: "Garage",
		status: "CONNECTED",
		sensortag: {},
		data: {},
	},{
		systemId: "5678",
		policyNumber: "Job2",
		name: "Garage2",
		status: "CONNECTED",
		sensortag: {},
		data: {},
	}];
}

import {
	beforeEach,
	beforeEachProviders,
	describe,
	expect,
	it,
	inject,
	injectAsync } from 'angular2/testing';
import {provide} from "angular2/core"

import {SensorService} from "./sensor.service"
import {Http} from 'angular2/http';

beforeEachProviders(() => {
	return [
		provide(Http, { useValue: {} }),
		provide(SensorService, {useClass: MockSensorService})
	]
})


describe('Sensor Service', () =>

	describe('on getSensorsForJob', () => {

		it('returns the sensors for a specific job', inject(
			[SensorService],
			(_sensorService: SensorService) => {

			let sensorsForJob = _sensorService.getSensorsForPolicy("Job1");
			expect(sensorsForJob).toEqual([{
				systemId: "1234",
				policyNumber: "Job1",
				name: "Garage",
				status: "CONNECTED",
				sensortag: {},
				data: {},
			}]);
		}));

	});
});