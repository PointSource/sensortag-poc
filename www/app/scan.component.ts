import {Component, Inject, ElementRef, OnInit, Output, EventEmitter} from 'angular2/core';
import {BLEService} from './ble.service';
import {Sensor} from './sensor';

@Component({
    selector: 'scanner-component',
    templateUrl: 'app/scan.component.html',
    inputs: ['sensors', 'connectedAddresses']
})
export class ScanComponent implements OnInit {

    sensors: Sensor[];
    private status: string;
    private connectedAddresses: any[];
    private scanIndex: number;
    private modalElement: any;

    @Output() onConnectionComplete = new EventEmitter();


    constructor(
        private myElement: ElementRef,
        private _bleService: BLEService,
        @Inject('CordovaDevice') private _cordovaDevice,
        private _elementRef: ElementRef,
        @Inject('jQuery') private _jquery,
        @Inject('Foundation') private _foundation
    ) { }

    ngOnInit() {
        console.log('inside scan component', this.sensors);
        this.modalElement = this._jquery(this._elementRef.nativeElement.children[0]);
        new this._foundation.Reveal(this.modalElement, { closeOnClick: false });

        // this.connectedAddresses = [];
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
            console.log("success emit")
            this.onConnectionComplete.emit({ connectedAddresses: this.connectedAddresses });

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
                console.log("FAIL emit")
                this.onConnectionComplete.emit({ connectedAddresses: this.connectedAddresses });
            }

        }
    }


}