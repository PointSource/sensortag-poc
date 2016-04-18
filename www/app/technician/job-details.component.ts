import {Component, OnInit} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Router} from 'angular2/router';

import {JobService} from './job.service';
import {SensorService} from '../sensor.service';
import {ReadingService} from './reading.service';
import {NavService} from '../nav.service';
import {Job} from './job';
import {Sensor} from '../sensor';
import {Reading} from './reading'

@Component({
    templateUrl: 'app/technician/job-details.component.html',
    styleUrls: ['app/technician/job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
    private job: Job;
    private sensors: Sensor[];
    private readings: Reading[] = [];

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _jobService: JobService,
        private _sensorService: SensorService,
        private _readingService: ReadingService,
        private _navService: NavService
    ) { }

    ngOnInit() {
        var policyNumber = this._routeParams.get('policyNumber');

        this.job = this._jobService.getJob(policyNumber);
        if (this.job === null) {
            window.history.back();
        }
        this._navService.setTitle(this.job.name);

        this.readings = [];
        this.sensors = [];

        this.sensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);

        this.readings = this._readingService.getReadingsForPolicy(this.job.policyNumber);
    }

    goToConfigureJob(policyNumber: string) {
        this._router.navigate(['ConfigureJob', { policyNumber: this.job.policyNumber }]);
    }

    takeReading() {
        this.readings = this._readingService.takeReading(this.sensors, this.job.policyNumber, false);
    }

    goToReadingDetails(type) {
        this._router.navigate(['ReadingHistory', { policyNumber: this.job.policyNumber, type: type }]);
    }

}