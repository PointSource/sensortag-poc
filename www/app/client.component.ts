import {Component} from 'angular2/core';
import {SensorService} from './sensor.service';
import {ConnectedDevice} from './connected-device';
import {SensorComponent} from './sensor.component';

@Component({
    templateUrl: 'app/client.component.html',
    directives: [SensorComponent]
})
export class ClientComponent {
    sensors: ConnectedDevice[];

    constructor(
        private _sensorService: SensorService
    ) { }

    loadSensors() {
        this._sensorService.fetch().add(() => {
            this.sensors = this._sensorService.getSensors();
            console.log('got sensors', this.sensors);
        });
    }

    sendData() {
		console.log('send sensor data');
    }

}