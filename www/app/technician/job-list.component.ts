import {Component, OnInit} from 'angular2/core';
import {Job} from './job'
import {Router} from 'angular2/router';

@Component({
    templateUrl: 'app/technician/job-list.component.html',
    // styleUrls: ['app/job-list.component.css']
})
export class JobListComponent implements OnInit {
	private jobList: Job[];

    constructor(
        private _router: Router
    ) { }

    ngOnInit() {
		this.jobList = [{
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

    goToTechnician() {
        this._router.navigate(['JobList', {}]);
    }

}