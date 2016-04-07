import {SensorService} from "./sensor.service"
import {Http} from 'angular2/http';

describe('Sensor Service', () => {
	let sensorService: SensorService;
	let http: Http;

	beforeEach(() => {
		sensorService = new SensorService(http);
	})

	describe('on getSensorsForJob', () => {

		beforeEach(() => {
			sensorService.sensors = [{
				status: "CONNECTED",
				sensortag: {},
				data: {},
				name: "Garage",
				isNamed: true,
				isConnected: true,
				device: {},
				policyNumber: "Job1"
			}, {
				status: "CONNECTED",
				sensortag: {},
				data: {},
				name: "Garage",
				isNamed: true,
				isConnected: true,
				device: {},
				policyNumber: "Job2"
			}]
		})

		it('returns the sensors for a specific job', () => {
			let sensorsForJob = sensorService.getSensorsForPolicy("Job1");
			expect(sensorsForJob).toEqual([{
				status: "CONNECTED",
				sensortag: {},
				data: {},
				name: "Garage",
				isNamed: true,
				isConnected: true,
				device: {},
				policyNumber: "Job1"
			}]);
		});

	});
});