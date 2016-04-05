import {Component, Output, EventEmitter} from 'angular2/core';
import {Router} from 'angular2/router';

@Component({
    selector: 'sensor',
    templateUrl: 'app/sensor.component.html',
    styleUrls: ['app/sensor.component.css'],
    inputs: ['sensor', 'dindex']
})
export class SensorComponent {
	sensor;
	dindex;
    @Output() onDeviceNamed = new EventEmitter();

    constructor(
        private _router: Router
	) { }

    nameDevice(name) {
        this.sensor.isNamed = true;
        this.sensor.name = name;
        this.onDeviceNamed.emit("event");
    }

    toggleDeviceConnection() {
        if (this.sensor.isConnected) {
            this.sensor.sensortag.disconnectDevice();
            this.sensor.status = "DISCONNECTED";
            this.sensor.isConnected = false;
        } else {
            this.sensor.sensortag.connectToDevice(this.sensor.device);
        }
    }

    goToSensorDetails() {
		this._router.navigate(['SensorDetail', { index: this.dindex }]);
    }

}