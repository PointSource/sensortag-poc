import {Component, OnInit, Inject, ElementRef} from 'angular2/core';
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
import {BLEService} from '../ble.service';

@Component({
    templateUrl: 'app/technician/job-details.component.html',
    styleUrls: ['app/technician/job-details.component.css']
})
export class JobDetailsComponent implements OnInit {
    private job: Job;
    private sensors: Sensor[];
    private readings: Reading[] = [];
    private status: string;
    private connectedAddresses: any[];
    private scanIndex: number;
    private modalElement: any;

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _bleService: BLEService,
        private _jobService: JobService,
        private _sensorService: SensorService,
        private _sensorFactory: SensorFactory,
        private _readingService: ReadingService,
        @Inject('CordovaDevice') private _cordovaDevice,
        private _navService: NavService,
        private _elementRef: ElementRef,
        @Inject('jQuery') private _jquery,
        @Inject('Foundation') private _foundation,
    ) { }

    ngOnInit() {
        this.modalElement = this._jquery(this._elementRef.nativeElement.children[0]);
        new this._foundation.Reveal(this.modalElement, { closeOnClick: false });

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
        console.log('savedSensors', savedSensors);
        console.log('policyNumber', policyNumber);
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


    // SCAN FOR SENSORS


    scanForSensors() {
        this.modalElement.foundation('open');

        this.connectedAddresses = [];

        this._bleService.disconnectAllDevices();

        this.status = "SCANNING";

        this.scanIndex = 0;

        this.setConnectCallbacks(this.sensors[this.scanIndex]);
        this.sensors[this.scanIndex].scanForSensor();
    }

    setConnectCallbacks(sensor) {
        var self = this;
        sensor.setOnDeviceConnected((device) => {
            self.onDeviceConnected(device);
        });
        sensor.setOnDeviceConnectFail((device) => {
            self.onDeviceConnectFail(device);
        });
    }

    clearConnectCallbacks(sensor) {
        var self = this;
        sensor.setOnDeviceConnected((device) => {
            if (self.connectedAddresses.indexOf(device.address) === -1) {
                self.connectedAddresses.push(device.address);
            }
        });
        sensor.setOnDeviceConnectFail(null);
    }

    onDeviceConnected(device) {
        var self = this;
        // Connect to the next device if this device is not already connected... ?
        if (this.connectedAddresses.indexOf(device.address) === -1) {
            this.connectedAddresses.push(device.address);
        }
        if ((this.scanIndex + 1) < this.sensors.length) {
            this.clearConnectCallbacks(this.sensors[this.scanIndex]);
            this.scanIndex++;

            this.setConnectCallbacks(this.sensors[this.scanIndex]);

            // Have to timeout on iOS to wait for devices to disconnect
            if (this._cordovaDevice.platform === "iOS") {
                console.log('CONNECT set timeout', this._cordovaDevice.platform);
                setTimeout(() => {
                    console.log('CONNECT resolve timeout');
                    this.sensors[this.scanIndex].scanForSensor();
                }, 10000)
            } else {
                this.sensors[this.scanIndex].scanForSensor();
            }
        } else {
            this.clearConnectCallbacks(this.sensors[this.scanIndex]);
            this.status = "DONE_CONNECTING";
        }
    }

    onDeviceConnectFail(status) {
        var self = this;
        console.log('on device connect fail', status);
        if ((this.scanIndex + 1) < this.sensors.length && status !== "NO_SENSORS") {
            this.clearConnectCallbacks(this.sensors[this.scanIndex]);
            this.scanIndex++;
            this.setConnectCallbacks(this.sensors[this.scanIndex]);

            // Have to timeout on iOS to wait for devices to disconnect
            if (this._cordovaDevice.platform === "iOS") {
                console.log('FAIL set timeout', this._cordovaDevice.platform);
                setTimeout(() => {
                    console.log('FAIL resolve timeout');
                    this.sensors[this.scanIndex].scanForSensor();
                }, 10000)
            } else {
                this.sensors[this.scanIndex].scanForSensor();
            }

        } else {
            if (status === "NO_SENSORS" && this.connectedAddresses.length === 0) {
                this.status = status;
            } else {
                this.clearConnectCallbacks(this.sensors[this.scanIndex]);
                this.scanIndex++;
                this.status = "DONE_CONNECTING";
            }
        }
    }

}