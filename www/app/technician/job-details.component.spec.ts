import {
	beforeEach,
	beforeEachProviders,
	describe,
	expect,
	it,
	inject,
	injectAsync } from 'angular2/testing';
import {provide} from "angular2/core"
import {JobDetailsComponent} from "./job-details.component"
import {JobService} from "./job.service"

beforeEachProviders(() => {
	return [
		JobService,
		JobDetailsComponent
	]
});

describe('Job Details Component', () => {

	let _jobDetails;

	beforeEach(inject(
		[JobDetailsComponent],
		(jobDetails: JobDetailsComponent) => {
			_jobDetails = jobDetails;
		}
	))

	describe('on init', () => {

		it('fills list with any devices that were saved', () => {
			_jobDetails._sensorService.addSensor({
				policyNumber: "01929"
			});
			spyOn(_jobDetails._sensorService, "getSensorsForPolicy").and.callThrough();
			_jobDetails.ngOnInit();
			expect(_jobDetails._sensorService.getSensorsForPolicy).toHaveBeenCalled();
			expect(_jobDetails.sensors.length).toBe(1);
		});
	});



});