import {Component, OnInit, Inject, NgZone} from 'angular2/core';
import {RouteParams} from 'angular2/router';
import {SensorService} from '../sensor.service';
import {JobService} from '../technician/job.service';
import {NavService} from '../nav.service';
import {BLEService} from '../ble.service';
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
    status: string;
    sensortag: any;

    // TEMP
    matchingDevices: any[];
    deviceAddresses: string[];

    constructor(
        private _sensorService: SensorService,
        private _jobService: JobService,
        private _bleService: BLEService,
        private _navService: NavService,
        private _routeParams: RouteParams,
        @Inject('Evothings') private _evothings,
        private _ngZone: NgZone
    ) { }

    ngOnInit() {

        var policyNumber = this._routeParams.get('policyNumber');
        this.job = this._jobService.getJob(policyNumber);
        this._navService.setTitle("My Sensors");


        this.matchingDevices = [];
        this.deviceAddresses = [];
    }

    loadSensors() {
        // this._sensorService.fetch().add(() => {
            this.sensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);
            // this.scanForSensors();
        // });

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
                }
            }, self.systemIdFail);
    }

    scanFail() {
        this.status = "SCAN_FAIL"
    }

    stopScanning() {
        this._evothings.easyble.stopScan();
    }

    gotSystemId (systemId, device) {
        var TEMPID = "0212d3000048b4b0";
        console.log(systemId);
        if (systemId === TEMPID) {
            console.log('matches!!');
            this.deviceAddresses.push(systemId);
            this.matchingDevices.push(device)
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