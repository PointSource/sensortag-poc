import {Component, OnInit, Inject, NgZone} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {SensorService} from '../sensor.service';
import {JobService} from '../technician/job.service';
import {NavService} from '../nav.service';
import {Sensor} from '../sensor';
import {Job} from '../technician/job';
import {SensorComponent} from '../sensor.component';

@Component({
    templateUrl: 'app/client/account-details.component.html',
    directives: [SensorComponent]
})
export class AccountDetailsComponent implements OnInit {
    sensors: Sensor[];
    job: Job;

    constructor(
        private _sensorService: SensorService,
        private _jobService: JobService,
        private _navService: NavService,
        private _routeParams: RouteParams,
        @Inject('Evothings') private _evothings,
        private _ngZone: NgZone
    ) { }

    ngOnInit() {
        var policyNumber = this._routeParams.get('policyNumber');
        this.job = this._jobService.getJob(policyNumber);
        this._navService.setTitle("My Sensors");
    }

    loadSensors() {
        // this._sensorService.fetch().add(() => {
            this.sensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);
            this.scanForSensors();
        // });

    }

    scanForSensors() {

    }


    statusHandler(index, status) {
        this.sensors[index].status = status;
        if (status === "DEVICE_INFO_AVAILABLE") {
            this.sensors[index].isConnected = true;
        }
    }

    takeReading() {
        alert("Reading successfully submitted");
    }

}