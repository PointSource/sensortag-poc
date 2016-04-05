import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Router} from 'angular2/router';

import {JobService} from './job.service';
import {SensorService} from '../sensor.service';
import {NavService} from '../nav.service';
import {Job} from './job';
import {Sensor} from '../sensor';

@Component({
    templateUrl: 'app/technician/job-details.component.html',
    // styleUrls: ['app/job-list.component.css']
})
export class JobDetailsComponent implements OnInit {
    private job: Job;
    private sensors: Sensor[];

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _jobService: JobService,
        private _sensorService: SensorService,
        private _navService: NavService
    ) { }

    ngOnInit() {
        var policyNumber = this._routeParams.get('policyNumber');

        this.job = this._jobService.getJob(policyNumber);
        if (this.job === null) {
            window.history.back();
        }
        this._navService.setTitle(this.job.name);

        this.sensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);

    }

    goToConfigureJob(policyNumber: string) {
        this._router.navigate(['ConfigureJob', { policyNumber: this.job.policyNumber }]);
    }

}