import {Component, Inject, ElementRef, OnInit, Output, EventEmitter} from 'angular2/core';
import {BLEService} from './ble.service';
import {ReadingService} from './technician/reading.service';
import {Sensor} from './sensor';
import {Job} from './technician/job';

@Component({
    selector: 'scanner-component',
    templateUrl: 'app/scan.component.html',
    inputs: ['sensors', 'job', 'isClient']
})
export class ScanComponent implements OnInit {

    sensors: Sensor[];
    private status: string;
    private job: Job;
    private connectedAddresses: any[];
    private scanIndex: number;
    private modalElement: any;
    private isClient: boolean;

    @Output() onConnectionComplete = new EventEmitter();


    constructor(
        private myElement: ElementRef,
        private _bleService: BLEService,
        private _readingService: ReadingService,
        @Inject('CordovaDevice') private _cordovaDevice,
        private _elementRef: ElementRef,
        @Inject('jQuery') private _jquery,
        @Inject('Foundation') private _foundation
    ) { }

    ngOnInit() {
        this.modalElement = this._jquery(this._elementRef.nativeElement.children[0]);
        new this._foundation.Reveal(this.modalElement, { closeOnClick: false });

        this.connectedAddresses = [];

        if (this.sensors.length > 0 && this.sensors[0].status !== "DISCONNECTED") {
            for (let sensor of this.sensors) {
                this.connectedAddresses.push(sensor.systemId);
            }
        }
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
        sensor.setOnDeviceConnected((device) => {
            this.onDeviceConnected(device);
        });
        sensor.setOnDeviceConnectFail((device) => {
            this.onDeviceConnectFail(device);
        });
    }

    clearConnectCallbacks(sensor) {
        sensor.setOnDeviceConnected((device) => {
            if (this.connectedAddresses.indexOf(device.address) === -1) {
                this.connectedAddresses.push(device.address);
            }
        });
        sensor.setOnDeviceConnectFail(null);
    }

    onDeviceConnected(device) {
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
            console.log("success emit")
            this.onConnectionComplete.emit({ allSensorsConnected: this.connectedAddresses.length === this.sensors.length });

        }
    }

    onDeviceConnectFail(status) {
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
                console.log("FAIL emit")
                this.onConnectionComplete.emit({ allSensorsConnected: this.connectedAddresses.length === this.sensors.length });
            }

        }
    }

    takeReading() {
        this._readingService.takeReading(this.sensors, this.job.policyNumber, this.isClient);
    }

}