import {SensorService} from "../sensor.service"
import {JobService} from "../technician/job.service"
import {Http} from 'angular2/http';

import {AccountDetailsComponent} from "./account-details.component"

describe('Account Details', () => {
	let _sensorService: SensorService;
	let _jobService: JobService;
	let _navService = jasmine.createSpyObj("_navService", ['setTitle']);
	let _http: Http;
	let _routeParams = jasmine.createSpyObj("_routeParams", ['get']);
	let accountDetails;

	beforeEach( () => {
		_sensorService = new SensorService(_http);
		_jobService = new JobService(_sensorService);

		spyOn(_jobService, "getJob").and.returnValue({
			policyNumber: "Job1",
			name: "Andrew Mortensen",
			numSensors: 0
		})

		accountDetails = new AccountDetailsComponent(
			_sensorService,
			_jobService,
			_navService,
			_routeParams
		);
	})

	describe('on get sensors for this policy', () => {

		it('scans for all the devices nearby', () => {
			accountDetails.ngOnInit();
			spyOn(accountDetails, "scanForSensors");
			accountDetails.loadSensors();
			expect(accountDetails.scanForSensors).toHaveBeenCalled();
		});

	});
});