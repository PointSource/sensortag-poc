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
    status: string;
    sensortag: any;
    availableDevices: any[];
    DEVICEINFO_SERVICE: string;
    SYSTEM_ID: string;

    constructor(
        private _sensorService: SensorService,
        private _jobService: JobService,
        private _navService: NavService,
        private _routeParams: RouteParams,
        @Inject('Evothings') private _evothings,
        private _ngZone: NgZone
    ) { }

    ngOnInit() {
        this.DEVICEINFO_SERVICE = '0000180a-0000-1000-8000-00805f9b34fb';
        this.SYSTEM_ID = '00002a23-0000-1000-8000-00805f9b34fb';


        var policyNumber = this._routeParams.get('policyNumber');
        this.job = this._jobService.getJob(policyNumber);
        this._navService.setTitle("My Sensors");

        // Create SensorTag CC2650 instance.
        this.sensortag = this._evothings.tisensortag.createInstance(
            this._evothings.tisensortag.CC2650_BLUETOOTH_SMART)

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
                self.scanSuccess(device)
            });
        }, function() {
            self._ngZone.run(function() {
                self.scanFail()
            });
        });

        setTimeout(() => { this.stopScanning() }, 1000);
    }

    stopScanning() {
        this._evothings.easyble.stopScan();
    }

    scanSuccess(device) {
        var self = this;

        if (this.sensortag.deviceIsSensorTag(device)) {
            this.status = "CONNECTING"
            device.connect(
                function(device) { 
                    self._ngZone.run(() => {
                        self.deviceConnectSuccess(device);
                    });
                }, this.deviceConnectFail)
        }
    }

    scanFail() {
        this.status = "SCAN_FAIL"
    }

    deviceConnectSuccess(device) {
        this.status = "READING DATA";
        device.readServices([this.DEVICEINFO_SERVICE], 
            (device) => {
                device.readServiceCharacteristic(
                    this.DEVICEINFO_SERVICE,
                    this.SYSTEM_ID,
                    (data) => {
                        var systemId = this._evothings.util.typedArrayToHexString(data);
                        console.log(systemId);
                    },
                    (error) => {
                        console.error(error);
                    }
                );
            },
            (error) => {
                console.error(error);
            })
    }

    deviceConnectFail(error) {
        this.status = "DEVICE FAIL"
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