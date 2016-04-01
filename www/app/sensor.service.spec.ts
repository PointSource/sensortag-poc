import {SensorService} from "./sensor.service"

describe('Sensor Service', () => {
	let sensorService: SensorService;

	beforeEach(() => {
		sensorService = new SensorService();
	})

	describe('on getSensorsForJob', () => {

		beforeEach(() => {
			sensorService.sensors = [{
				status: "CONNECTED",
				sensortag: {},
				data: {},
				address: "address123",
				name: "Garage",
				isNamed: true,
				isConnected: true,
				device: {},
				job: "Job1"
			}, {
				status: "CONNECTED",
				sensortag: {},
				data: {},
				address: "address123",
				name: "Garage",
				isNamed: true,
				isConnected: true,
				device: {},
				job: "Job2"
			}]
		})

		it('returns the sensors for a specific job', () => {
			let sensorsForJob = sensorService.getSensorsForJob("Job1");
			expect(sensorsForJob).toEqual([{
				status: "CONNECTED",
				sensortag: {},
				data: {},
				address: "address123",
				name: "Garage",
				isNamed: true,
				isConnected: true,
				device: {},
				job: "Job1"
			}]);
		});

	});
});