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
    // styleUrls: ['app/job-list.component.css']
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

        this.sensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);

        this.readings = this._readingService.getReadingsForPolicy(this.job.policyNumber);
    }

    goToConfigureJob(policyNumber: string) {
        this._router.navigate(['ConfigureJob', { policyNumber: this.job.policyNumber }]);
    }

    takeReading() {
        if (this.sensors.length > 0) {
            let reading: Reading = {
                policyNumber: this.job.policyNumber,
                date: new Date().getTime(),
                sensorData: []
            };
            for (let sensor of this.sensors) {
                reading.sensorData.push({
                    name: sensor.name,
                    address: sensor.device.address,
                    data: {
                        humidityData: {
                            relativeHumidity: sensor.data.humidityData.relativeHumidity
                        }
                    }
                });
            }

            this._readingService.addReading(reading);
            this.readings = this._readingService.getReadingsForPolicy(this.job.policyNumber);
            console.log(this.readings);
        }
    }

}