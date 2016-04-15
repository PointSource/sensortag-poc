import {Component, OnInit, Inject, NgZone, ElementRef} from 'angular2/core';
import {RouteParams} from 'angular2/router';

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
    foundAddresses: any[]
    sensors: Sensor[];
    job: Job;
    status: string;
    sensortag: any;
    private modalElement: any;

    constructor(
        private _sensorService: SensorService,
        private _jobService: JobService,
        private _bleService: BLEService,
        private _navService: NavService,
        private _readingService: ReadingService,
        private _routeParams: RouteParams,
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
        this.foundAddresses = [];
        this.sensors = [];
        var policyNumber = this._routeParams.get('policyNumber');
        this.job = this._jobService.getJob(policyNumber);
        this._navService.setTitle("My Sensors");
        this.loadSensors();
    }

    loadSensors() {
        this._sensorService.fetch().add(() => {
            let savedSensors = this._sensorService.getSensorsForPolicy(this.job.policyNumber);
            for (let savedSensor of savedSensors) {
                var sensor = this._sensorFactory.sensor(this.job.policyNumber);
                sensor.setName(savedSensor.name);
                sensor.setSystemId(savedSensor.systemId);
                this.sensors.push(sensor);
            }

            if (this.sensors.length > 0) {
                this.scanForSensors();
            } else {
                this.status = "No Sensors on Account";
            }
        });

    }

    scanForSensors() {
        var self = this;

        this.modalElement.foundation('open');
        this.status = "SCANNING";
        this._bleService.disconnectAllDevices();
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
        console.log("scanSuccess");
        var self = this;

        if (this._bleService.deviceIsSensorTag(device) && this.foundAddresses.indexOf(device.address) === -1) {
            this.foundAddresses.push(device.address);
            this._bleService.getSystemIdFromDevice(device, 
                (systemId, device) => {
                    console.log("gotSystemId success");

                    self._ngZone.run(() => {
                        self.gotSystemId(systemId, device);
                    });
                }, self.systemIdFail
            );
        }

    }

    scanFail() {
        console.error("scanFail");
        this.status = "SCAN_FAIL";
    }

    stopScanning() {
        console.log("stopScanning", this.foundAddresses);
        if (this.foundAddresses.length < this.sensors.length) {
            this.status = "Found " + this.foundAddresses.length + " sensors of " + this.sensors.length;
        } else {
            this.modalElement.foundation('close');
        }
        this._evothings.easyble.stopScan();
    }

    gotSystemId (systemId, device) {
        console.log("gotSystemId", systemId);
        var foundSensor = this.sensors.find((sensor) => {
            return sensor.systemId === systemId;
        })
        if (foundSensor !== undefined) {
            console.log('matches!!');
            device.close();
            foundSensor.connectToDevice(device);
        } else {
            console.log('disconnecting');
            device.close();
        }

    }

    systemIdFail(error) {
        console.log("systemIdFail");
        console.error(error);
    }

    takeReading() {
        this._readingService.takeReading(this.sensors, this.job.policyNumber, true);
    }

}