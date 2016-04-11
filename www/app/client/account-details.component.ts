import {Component, OnInit, Inject, NgZone, Injector} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {SensorService} from '../sensor.service';
import {JobService} from '../technician/job.service';
import {NavService} from '../nav.service';
import {BLEService} from '../ble.service';

import {Sensor} from '../sensor';
import {SensorClass} from '../sensor.class';
import {Job} from '../technician/job';
import {SensorComponent} from '../sensor.component';

@Component({
    templateUrl: 'app/client/account-details.component.html',
    directives: [SensorComponent],
    providers: [SensorClass]
})
export class AccountDetailsComponent implements OnInit {
    savedSensors: any[];
    sensors: Sensor[];
    job: Job;
    status: string;
    sensortag: any;

    constructor(
        private _sensorService: SensorService,
        private _jobService: JobService,
        private _bleService: BLEService,
        private _navService: NavService,
        private _routeParams: RouteParams,
        @Inject('Evothings') private _evothings,
        private _ngZone: NgZone,
        private _injector: Injector
    ) { }

    ngOnInit() {
        this.sensors = [];
        var policyNumber = this._routeParams.get('policyNumber');
        this.job = this._jobService.getJob(policyNumber);
        this._navService.setTitle("My Sensors");
    }

    loadSensors() {
        this._sensorService.fetch().add(() => {
            this.savedSensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);
            this.scanForSensors();
        });

    }

    scanForSensors() {
        var self = this;
        this.status = "SCANNING";
        this._evothings.easyble.startScan(function(device) {
            self._ngZone.run(() => {
                self.scanSuccess(device);
            });
        }, function() {
            self._ngZone.run(function() {
                self.scanFail()
            });
        });

        setTimeout(() => { this.stopScanning() }, 1000);
    }

    scanSuccess(device) {
        var self = this;

        this._bleService.getSystemIdFromDevice(device, 
            (systemId, device) => {
                self._ngZone.run(() => {
                    self.gotSystemId(systemId, device);
                });
            }, self.systemIdFail);
    }

    scanFail() {
        this.status = "SCAN_FAIL"
    }

    stopScanning() {
        this._evothings.easyble.stopScan();
    }

    gotSystemId (systemId, device) {
        console.log(systemId);
        var foundSensor = this.savedSensors.find((sensor) => {
            return sensor.systemId === systemId;
        })
        if (foundSensor !== undefined) {
            console.log('matches!!');
            device.close();
            var sensor: SensorClass = this._injector.get(SensorClass);
            sensor.initialize(this.job.policyNumber, foundSensor.name);
            sensor.connectToDevice(device);
            this.sensors.push(sensor);
        } else {
            console.log('disconnecting');
            device.close();
        }

    }

    systemIdFail(error) {
        console.error(error);
    }

    takeReading() {
        alert("Reading successfully submitted");
    }

}