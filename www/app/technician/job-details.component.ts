import {Component, OnInit, Inject} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {Router} from 'angular2/router';

import {JobService} from './job.service';
import {SensorService} from '../sensor.service';
import {SensorFactory} from '../sensor.factory';
import {ReadingService} from './reading.service';
import {NavService} from '../nav.service';
import {Job} from './job';
import {Sensor} from '../sensor';
import {Reading} from './reading'

import {ScanComponent} from '../scan.component';
import {ChartComponent} from '../chart.component';

@Component({
    templateUrl: 'app/technician/job-details.component.html',
    styleUrls: ['app/technician/job-details.component.css'],
    directives: [ScanComponent, ChartComponent]
})
export class JobDetailsComponent implements OnInit {
    private job: Job;
    private sensors: Sensor[];
    private readings: Reading[] = [];
    private connectedAddresses: any[];

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _jobService: JobService,
        private _sensorService: SensorService,
        private _sensorFactory: SensorFactory,
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
        this._navService.setBack(() => {
            this._router.navigate(['JobList', { }]);
        }); 

        this.readings = [];
        this.sensors = [];
        this.connectedAddresses = [];

        // this.sensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);
        var savedSensors = this._sensorService.getSensorsForPolicy(policyNumber);
        if (savedSensors.length > 0 && savedSensors[0].data === undefined) {
            for (let savedSensor of savedSensors) {
                var sensor = this._sensorFactory.sensor(this.job.policyNumber);
                sensor.setName(savedSensor.name);

                sensor.setSystemId(savedSensor.systemId);
                this.sensors.push(sensor);
                this._sensorService.replaceSensor(sensor);
            }

        } else {
            this.sensors = savedSensors;
            for (let sensor of this.sensors) {
                this.connectedAddresses.push(sensor.systemId);
            }
        }

        this.loadReadings();
    }

    loadReadings() {
        this._readingService.fetch().add(() => {
            this.readings = this._readingService.getReadingsForPolicy(this.job.policyNumber);
        });
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


    connectionCompleteHandler($event) {
        this.connectedAddresses = $event.connectedAddresses;
    }

}