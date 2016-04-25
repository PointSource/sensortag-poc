import {SensorService} from "./sensor.service"

import {
	beforeEach,
	beforeEachProviders,
	describe,
	expect,
	it,
	inject,
	injectAsync } from 'angular2/testing';
import {provide} from "angular2/core"

beforeEachProviders(() => {
	return [
		SensorService
	]
})


describe('Sensor Service', () =>

	describe('on getSensorsForJob', () => {

		it('returns the sensors for a specific job', inject(
			[SensorService],
			(_sensorService: SensorService) => {

				_sensorService.addSensor({
					systemId: "1234",
					policyNumber: "Job1",
					name: "Garage",
					status: "CONNECTED",
					sensortag: {},
					data: {},
				});

				_sensorService.addSensor({
					systemId: "5678",
					policyNumber: "Job2",
					name: "Garage2",
					status: "CONNECTED",
					sensortag: {},
					data: {},
				});

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