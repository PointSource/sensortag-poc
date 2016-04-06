import {Component, OnInit, Inject, NgZone} from 'angular2/core';
import {SensorService} from './sensor.service';
import {NavService} from './nav.service';
import {Sensor} from './sensor';
import {SensorComponent} from './sensor.component';

@Component({
    templateUrl: 'app/client.component.html',
    directives: [SensorComponent]
})
export class ClientComponent implements OnInit {
    sensors: Sensor[];

    constructor(
        private _sensorService: SensorService,
        private _navService: NavService,
        @Inject('Evothings') private _evothings,
        private _ngZone: NgZone
    ) { }

    ngOnInit() {
        this._navService.setTitle("Get Account");
    }

    loadSensors() {
        this._sensorService.fetch().add(() => {
            this.sensors = this._sensorService.getSensors();

            let index = 0;
            for (let sensor of this.sensors) {
                sensor.isConnected = false;
                this.initSensorTag(sensor, index);
                index++;
            }
        });
    }

    initSensorTag(sensor, index) {
        var self = this;

        // Create SensorTag CC2650 instance.
        sensor.sensortag = this._evothings.tisensortag.createInstance(
            this._evothings.tisensortag.CC2650_BLUETOOTH_SMART)

        sensor.sensortag
            .statusCallback(function(status) {
                self._ngZone.run(function() {
                    self.statusHandler(index, status)
                });
            })
            // .humidityCallback(function(data) {
            //     self._ngZone.run(function() {
            //         self.humidityHandler(index, data);
            //     });
            // }, 1000)
            // .keypressCallback(function(data) {
            //     self._ngZone.run(function() {
            //         self.keypressHandler(index, data);
            //     });
            // }, 1000);

        // sensor.sensortag.connectToDevice(sensor.device);
    }

    statusHandler(index, status) {
        this.sensors[index].status = status;
        if (status === "DEVICE_INFO_AVAILABLE") {
            this.sensors[index].isConnected = true;
        }
    }

    sendData() {
		console.log('send sensor data');
    }

}