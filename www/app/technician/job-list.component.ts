import {Component, OnInit, ElementRef, Inject} from 'angular2/core';
import {NavService} from '../nav.service';
import {JobService} from './job.service';
import {Job} from './job';
import {Router} from 'angular2/router';

@Component({
    templateUrl: 'app/technician/job-list.component.html',
    // styleUrls: ['app/job-list.component.css']
})
export class JobListComponent implements OnInit {
	private jobList: Job[];
    private modalElement: any;
    private newJob: Job;

    constructor(
        private _router: Router,
        private _navService: NavService,
        private _jobService: JobService,
        private myElement: ElementRef,
        @Inject('Foundation') private _foundation,
    ) { }

    ngOnInit() {
        this._navService.setTitle("My Jobs");

        this.newJob = {
            name: "",
            policyNumber: ""
        }

        this.jobList = this._jobService.getJobs();
        this.modalElement = $(this.myElement.nativeElement.children[0]);
        var elem = new this._foundation.Reveal(this.modalElement);
    }

    addJob() {
        this.modalElement.foundation('open');
    }

    addJobToList() {
        let policyNumber = this.newJob.policyNumber;
        this._jobService.addJob({
            name: this.newJob.name,
            policyNumber: this.newJob.policyNumber
        });

        this.jobList = this._jobService.getJobs();

        this.newJob = {
            name: "",
            policyNumber: ""
        }

        this.modalElement.foundation('close');

        this.goToJob(policyNumber);
    }

    goToJob(policyNumber: string) {
        this._router.navigate(['ConfigureJob', { policyNumber: policyNumber }]);

    }


}