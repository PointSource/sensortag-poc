import {Component, OnInit, ElementRef, Inject} from 'angular2/core';
import {NavService} from '../nav.service';
import {JobService} from './job.service';
import {SensorService} from '../sensor.service';
import {Job} from './job';
import {Router} from 'angular2/router';

@Component({
    templateUrl: 'app/technician/job-list.component.html'
})
export class JobListComponent implements OnInit {
	private jobList: Job[];
    private modalElement: any;
    private newJob: Job;

    constructor(
        private _router: Router,
        private _navService: NavService,
        private _jobService: JobService,
        private _sensorService: SensorService,
        private myElement: ElementRef,
        @Inject('Foundation') private _foundation,
        @Inject('jQuery') private _jquery
    ) { }

    ngOnInit() {
        this._navService.setTitle("My Jobs");
        this._navService.setBack(() => {
            this._router.navigate(['Landing', {}]);
        });

        this.newJob = {
            name: "",
            policyNumber: "",
            numSensors: 0
        }
        this.jobList = this._jobService.getJobs();

        this.modalElement = this._jquery(this.myElement.nativeElement.children[0]);
        var elem = new this._foundation.Reveal(this.modalElement);
    }

    addJob() {
        this.modalElement.foundation('open');
    }

    addJobToList() {
        let policyNumber = this.newJob.policyNumber;
        this._jobService.addJob({
            name: this.newJob.name,
            policyNumber: this.newJob.policyNumber,
            numSensors: 0
        });

        this.jobList = this._jobService.getJobs();

        this.newJob = {
            name: "",
            policyNumber: "",
            numSensors: 0
        }

        this.modalElement.foundation('close');

        this._router.navigate(['ConfigureJob', { policyNumber: policyNumber }]);
    }

    goToJob(job: Job) {
        if (job.numSensors > 0) {
            this._router.navigate(['JobDetails', { policyNumber: job.policyNumber }]);
        } else {
            this._router.navigate(['ConfigureJob', { policyNumber: job.policyNumber }]);
        }
    }


}