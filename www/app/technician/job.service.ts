import {Injectable} from 'angular2/core';
import {Job} from './job';
// import {Http, Headers, Response} from 'angular2/http';
// import 'rxjs/Rx';

@Injectable()
export class JobService {
	public jobs: Job[] = [];

	constructor(
        // private _http: Http
	) {
		this.jobs = [{
			name: "Williams, Randy",
			policyNumber: "95916"
		}, {
			name: "Gartland, JP",
			policyNumber: "00012"
		}, {
			name: "Peterson, Jared",
			policyNumber: "01929"
		}]
	}

	getJobs(): Job[] {
		return this.jobs;
	}

	addJob(job: Job) {
		this.jobs.push(job);
	}

}