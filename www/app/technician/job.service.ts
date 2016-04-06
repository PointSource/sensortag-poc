import {Injectable} from 'angular2/core';
import {Job} from './job';
import {SensorService} from '../sensor.service';
// import {Http, Headers, Response} from 'angular2/http';
// import 'rxjs/Rx';

@Injectable()
export class JobService {
	public jobs: Job[] = [];

	constructor(
		private _sensorService: SensorService
        // private _http: Http
	) {
		this.jobs = [{
			name: "Williams, Randy",
			policyNumber: "95916",
			numSensors: 0
		}, {
			name: "Gartland, JP",
			policyNumber: "00012",
			numSensors: 0
		}, {
			name: "Peterson, Jared",
			policyNumber: "01929",
			numSensors: 0
		}]
	}

	getJobs(): Job[] {
		for (let job of this.jobs) {
			job.numSensors = this._sensorService.countSensorsForPolicy(job.policyNumber);
		}

		return this.jobs;
	}

	addJob(job: Job) {
		this.jobs.push(job);
	}

	getJob(policyNumber: string): Job {
		return this.jobs.find(
			(job) => job.policyNumber === policyNumber
		);
	}

}