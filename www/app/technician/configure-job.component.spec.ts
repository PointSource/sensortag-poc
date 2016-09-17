import {
	beforeEach,
	beforeEachProviders,
	describe,
	expect,
	it,
	inject,
	injectAsync } from 'angular2/testing';
import {provide} from "angular2/core"
import {ConfigureJobComponent} from "./configure-job.component"
import {JobService} from "./job.service"
import {RouteParams} from 'angular2/router';
import {ElementRef} from 'angular2/core';
import {FOUNDATION, JQUERY} from '../app.token';

var MockElementRef = {
	nativeElement: {
		children: []
	}
}

class MockRouteParams extends RouteParams {
	get() {
		return "01929"
	}
}


class MockJobService extends JobService {
	get() {
		return "Job1"
	}
}


var sensortag = {
};

var sensor = {
	initialize: () => { },
	sensortag: {},
	connectToDevice: () => { },
	setName: () => { },
	policyNumber: '01929',
	data: {
		humidityData: {
			lastTenValues: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			relativeHumidity: 0
		},
		temperatureData: {
			lastTenAmbient: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			lastTenTarget: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			ambientTemperature: 0,
			targetTemperature: 0
		},
		keypressData: 0
	}
};

let foundation = jasmine.createSpyObj("_foundation", ['Reveal']);


beforeEachProviders(() => {
	return [
		JobService,
		provide(RouteParams, { useClass: MockRouteParams }),
		provide(FOUNDATION, {useValue: foundation}),
		provide(ElementRef, { useValue: MockElementRef }),
		ConfigureJobComponent,
		provide(JQUERY, {
			useValue: () => {
				return {
					foundation: () => { }
				}
			}
		}),

	]
});

describe('Configure Job Component', () => {

	let _configureJob;
	let _jobService;

	beforeEach(inject(
		[ConfigureJobComponent, JobService],
		(configureJob: ConfigureJobComponent, jobService: JobService) => {
			_configureJob = configureJob;
			_jobService = jobService;
			_jobService.addJob({
				name: "Peterson, Jared",
				policyNumber: "01929",
				numSensors: 0
			});
		}
	))

	describe('on init', () => {

		it('fills list with any devices that were saved', () => {
			_configureJob._sensorService.addSensor({
				policyNumber: "01929"
			});
			spyOn(_configureJob._sensorService, "getSensorsForPolicy").and.callThrough();
			_configureJob.ngOnInit();
			expect(_configureJob._sensorService.getSensorsForPolicy).toHaveBeenCalled();
			expect(_configureJob.sensors.length).toBe(1);
		});
	});



	describe('when device is connected', () => {

		beforeEach(() => {
			_configureJob.ngOnInit();
		})

		it('adds the sensortag to the list of connected devices', () => {
			spyOn(_configureJob._sensorService, "addSensor").and.callThrough();
			_configureJob.deviceConnectedHandler(sensor);
			expect(_configureJob._sensorService.addSensor).toHaveBeenCalled();
			console.log(_configureJob.sensors);
			console.log(_configureJob.job.policyNumber);
			expect(_configureJob.sensors[0].data.humidityData.lastTenValues)
				.toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		})

	});

	describe('on status update', () => {


		it('should update main status', () => {
			_configureJob.ngOnInit();
			spyOn(_configureJob.modalElement, "foundation");
			_configureJob.statusHandler(sensortag, "SCANNING");
			expect(_configureJob.status).toBe("SCANNING");
		});


		it('should update status percentage', () => {
			_configureJob.ngOnInit();
			_configureJob.statusHandler(sensortag, "SCANNING");
			expect(_configureJob.statusPercentage).toBe(20);
			_configureJob.statusHandler(sensortag, "SENSORTAG_FOUND");
			expect(_configureJob.statusPercentage).toBe(40);
			_configureJob.statusHandler(sensortag, "CONNECTING");
			expect(_configureJob.statusPercentage).toBe(60);
			_configureJob.statusHandler(sensortag, "READING_DEVICE_INFO");
			expect(_configureJob.statusPercentage).toBe(80);
			_configureJob.statusHandler(sensortag, "DEVICE_INFO_AVAILABLE");
			expect(_configureJob.statusPercentage).toBe(100);
		});

		it('if status is DEVICE_INFO_AVAILABLE add sensortag to connected devices', () => {
			_configureJob.ngOnInit();
			spyOn(_configureJob, "deviceConnectedHandler");
			_configureJob.statusHandler(sensortag, "DEVICE_INFO_AVAILABLE");
			expect(_configureJob.deviceConnectedHandler).toHaveBeenCalled();
		});

	});

	// Move this to sensor component spec

	// xdescribe('when device is named', () => {
	// 	it('sets device name to new name', () => {
	// 		_configureJob.ngOnInit();
	// 		_configureJob.deviceConnectedHandler(sensor);
	// 		_configureJob.nameSensor("new name");
	// 		expect(_configureJob.sensors[0].name).toBe("new name");
	// 	});

	// });

});