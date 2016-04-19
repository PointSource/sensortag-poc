import {Component, OnInit, Inject, NgZone, ElementRef} from 'angular2/core';
// import {RouteParams} from 'angular2/router';

import {SensorService} from '../sensor.service';
import {JobService} from '../technician/job.service';
import {ReadingService} from '../technician/reading.service';
import {NavService} from '../nav.service';
import {BLEService} from '../ble.service';

import {Sensor} from '../sensor';
import {SensorFactory} from '../sensor.factory';
import {Job} from '../technician/job';
import {SensorComponent} from '../sensor.component';

@Component({
    templateUrl: 'app/client/account-details.component.html',
    directives: [SensorComponent]
})
export class AccountDetailsComponent implements OnInit {
    connectedAddresses: any[];
    sensors: Sensor[];
    job: Job;
    status: string;
    scanIndex: number;
    sensortag: any;
    private modalElement: any;

    constructor(
        private _sensorService: SensorService,
        private _jobService: JobService,
        private _bleService: BLEService,
        private _navService: NavService,
        private _readingService: ReadingService,
        private _elementRef: ElementRef,
        @Inject('Evothings') private _evothings,
        @Inject('jQuery') private _jquery,
        @Inject('Foundation') private _foundation,
        private _ngZone: NgZone,
        private _sensorFactory: SensorFactory
    ) { }

    ngOnInit() {
        this.modalElement = this._jquery(this._elementRef.nativeElement.children[0]);
        new this._foundation.Reveal(this.modalElement, { closeOnClick: false });
        this.connectedAddresses = [];
        this.sensors = [];
        this._navService.setTitle("My Sensors");

        // If client sensors have not been loaded, ask the user for their policy
        // number so you can load the sensors.
        if (this._sensorService.clientSensors.length === 0) {
            this.modalElement.foundation('open');
        } else {
            this.sensors = this._sensorService.getClientSensors();
            for (let sensor of this.sensors) {
                this.connectedAddresses.push(sensor.systemId);
            }
        }
    }

    findAccount(policyNumber: string) {
        var job = this._jobService.getJob(policyNumber);

        if (job === undefined) {
            this.status = "ERROR";
        } else {
            this.job = job;
            this.loadSensors();
        }
    }

    loadSensors() {
        var self = this;
        let savedSensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);
        for (let savedSensor of savedSensors) {
            var sensor = this._sensorFactory.sensor(this.job.policyNumber);
            sensor.setName(savedSensor.name);
            sensor.setOnDeviceConnected((device) => {
                self.onDeviceConnected(device);
            });
            sensor.setOnDeviceConnectFail((device) => {
                self.onDeviceConnectFail(device);
            })

            sensor.setSystemId(savedSensor.systemId);
            this.sensors.push(sensor);
        }

        if (this.sensors.length > 0) {
            this.scanForSensors();
        } else {
            this.status = "No Sensors on Account";
        }
    }

    scanForSensors() {
        this.modalElement.foundation('open');

        this.connectedAddresses = [];

        this._bleService.disconnectAllDevices();

        this.status = "SCANNING";

        this.scanIndex = 0;
        this.sensors[this.scanIndex].scanForSensor();
    }

    onDeviceConnected (device) {
        // Connect to the next device if this device is not already connected... ?
        if (this.connectedAddresses.indexOf(device.address) === -1) {
            this.connectedAddresses.push(device.address);
        }
        if ((this.scanIndex + 1) < this.sensors.length) {
            this.scanIndex++;
            this.sensors[this.scanIndex].scanForSensor();
        } else {
            this.status = "DONE_CONNECTING";
        }
    }

    onDeviceConnectFail (status) {
        console.log('on device connect fail', status);
        if ((this.scanIndex + 1) < this.sensors.length) {
            this.scanIndex++;
            this.sensors[this.scanIndex].scanForSensor();
        } else {
            this.scanIndex++;
            this.status = "DONE_CONNECTING";
        }
    }

    takeReading() {
        this._sensorService.setClientSensors(this.sensors);
        this._readingService.takeReading(this.sensors, this.job.policyNumber, true);
    }

    cancel() {
        this.modalElement.foundation('close');
        window.history.back();
    }

}